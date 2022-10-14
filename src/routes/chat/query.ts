import { FromSchema } from 'json-schema-to-ts'
import webpush from 'web-push'

import {
  GOOGLE_FIREBASE_API_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_PUBLIC_KEY,
} from '../../common/constants'
import { ForbiddenError, ServiceUnavailableError, UnauthorizedError } from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { redisClient } from '../../common/redis'
import areMyChatrooms from './sql/areMyChatrooms.sql'
import { FastifyHttp2 } from '..'

webpush.setGCMAPIKey(GOOGLE_FIREBASE_API_KEY)
webpush.setVapidDetails('mailto:jayudam2022@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

export default function chatQuery(fastify: FastifyHttp2) {
  const schema = {
    querystring: {
      type: 'object',
      properties: {
        chatroomIds: { type: 'string' },
      },
      additionalProperties: false,
      required: ['chatroomIds'],
    },
  } as const

  type Schema = { Querystring: FromSchema<typeof schema.querystring> }

  fastify.get<Schema>('/chat/subscribe', { schema }, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const chatroomIds = JSON.parse(request.query.chatroomIds) as string[]

    const { rows } = await poolQuery(areMyChatrooms, [userId, chatroomIds])
    if (!rows[0].are_all_included) throw ForbiddenError()

    // HTTP2 server push header
    const raw = reply.raw

    const headers = reply.getHeaders()
    for (const key in headers) {
      raw.setHeader(key, headers[key] ?? '')
    }
    raw.setHeader('Content-Type', 'text/event-stream')
    raw.setHeader('Cache-Control', 'no-cache,no-transform')

    raw.write('retry: 60000\n\n')
    // // request.socket.setTimeout(3_600)

    // Redis Pub/Sub
    const redisSubscription = redisClient.duplicate()
    const chatroomChannels = chatroomIds.map((chatroomId) => `chatroom:${chatroomId}`)

    redisSubscription.subscribe(...chatroomChannels, (err) => {
      if (err) throw ServiceUnavailableError(err.message)
    })

    redisSubscription.on('message', (channel, message) => {
      raw.write(`data: ${message}\n\n`)
    })

    redisClient.publish(`${userId}:loginStatus`, 't')

    // HTTP2 연결 끊기면
    request.raw.on('close', () => {
      redisClient.publish(`${userId}:loginStatus`, 'f')
      redisSubscription.quit()
    })
  })
}
