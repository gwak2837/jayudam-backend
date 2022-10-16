import { Type } from '@sinclair/typebox'

import { ForbiddenError, ServiceUnavailableError, UnauthorizedError } from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { redisClient } from '../../common/redis'
import { Chatrooms } from './object'
import areMyChatrooms from './sql/areMyChatrooms.sql'
import { IChatroomsResult } from './sql/chatrooms'
import chatrooms from './sql/chatrooms.sql'
import { TFastify } from '..'

export default function chatQuery(fastify: TFastify) {
  const option = {
    schema: {
      querystring: Type.Object({
        chatroomIds: Type.String(),
      }),
    },
  }

  fastify.get('/chat/subscribe', option, async (request, reply) => {
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

    redisSubscription.on('message', (_, message) => {
      raw.write(`data: ${message}\n\n`)
    })

    redisClient.publish(`${userId}:loginStatus`, 't')

    // HTTP2 연결 끊기면
    request.raw.on('close', () => {
      redisClient.publish(`${userId}:loginStatus`, 'f')
      redisSubscription.quit()
    })
  })

  const option2 = {
    schema: {
      response: {
        200: Chatrooms,
      },
    },
  }

  fastify.get('/chat/room', option2, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IChatroomsResult>(chatrooms, [userId])
    console.log('👀 - rows', rows)

    // reply.status(200).send(rows)
  })
}
