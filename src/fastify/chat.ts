import { FastifySchema } from 'fastify'

import { redisClient } from '../database/redis'
import { ServiceUnavailableError, UnauthorizedError } from './errors'
import { FastifyHttp2 } from './server'

export default function setServerPush(fastify: FastifyHttp2) {
  const schema: FastifySchema = {
    querystring: {
      type: 'object',
      properties: {
        chatroomIds: { type: 'array' },
      },
      required: ['chatroomIds'],
    },
  }

  fastify.get('/chat/subscribe', { schema }, (request, reply) => {
    if (!request.userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const userId = request.userId
    const raw = reply.raw

    // HTTP2 server push header
    const headers = reply.getHeaders()
    for (const key in headers) {
      raw.setHeader(key, headers[key] ?? '')
    }
    raw.setHeader('Content-Type', 'text/event-stream')
    raw.setHeader('Cache-Control', 'no-cache,no-transform')

    // Reconnection
    raw.write('retry: 10000\n\n')
    // request.socket.setTimeout(3_600)

    // Redis Pub/Sub
    const redisSubscription = redisClient.duplicate()

    redisClient.publish('chatroomId', `${userId} 님이 입장하셨습니다`)

    redisSubscription.subscribe(`chatroomId`, (err) => {
      if (err) throw ServiceUnavailableError(err.message)

      raw.write('data: 방에 입장하셨습니다\n\n')
    })

    redisSubscription.on('message', (channel, message) => {
      console.log(`${channel}: ${message}`)
      raw.write(`data: ${message}\n\n`)
    })

    // HTTP2 연결 끊기면
    request.raw.on('close', () => {
      console.log('👀 - close', userId)
      redisClient.publish('chatroomId', `${userId} 님이 퇴장하셨습니다`)
      redisSubscription.quit()
    })
  })

  const schema2: FastifySchema = {
    body: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        chatroomId: { type: 'string' },
      },
      required: ['chatroomId'],
    },
  }

  type Schema2 = {
    Body: {
      message: string
      chatroomId: string
    }
  }

  fastify.post<Schema2>('/chat/send', { schema: schema2 }, (request, reply) => {
    if (!request.userId) throw UnauthorizedError('로그인 후 시도해주세요')

    redisClient.publish(request.body.chatroomId, request.body.message)
    reply.status(201).send()
  })
}

let id = 0

function getId() {
  return id++
}
