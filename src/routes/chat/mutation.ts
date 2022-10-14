import { FromSchema } from 'json-schema-to-ts'

import {
  BadRequestError,
  ForbiddenError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { redisClient } from '../../common/redis'
import webpush from '../../common/web-push'
import { ICreateChatResult } from './sql/createChat'
import createChat from './sql/createChat.sql'
import isMyChatroom from './sql/isMyChatroom.sql'
import { IMessageSenderResult } from './sql/messageSender'
import messageSender from './sql/messageSender.sql'
import { FastifyHttp2 } from '..'

export default function chatMutation(fastify: FastifyHttp2) {
  const schema = {
    body: {
      type: 'object',
      properties: {
        chatroomId: { type: 'string' },
        message: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            type: { type: 'number' },
          },
          additionalProperties: false,
          required: ['content', 'type'],
        },
      },
      additionalProperties: false,
      required: ['chatroomId', 'message'],
    },
  } as const

  type Schema = { Body: FromSchema<typeof schema.body> }

  fastify.post<Schema>('/chat/send', { schema }, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { chatroomId, message } = request.body

    const { rows } = await poolQuery(isMyChatroom, [chatroomId])

    const userIds = rows.map((row) => row.user_id)
    if (!userIds.includes(userId)) throw ForbiddenError()

    const { rows: rows2 } = await poolQuery<ICreateChatResult>(createChat, [
      message.content,
      message.type,
      userId,
    ])

    const { rows: rows3 } = await poolQuery<IMessageSenderResult>(messageSender, [userId])

    // HTTP Server Push 보내기
    const receiverCount = await redisClient.publish(
      chatroomId,
      JSON.stringify({
        id: rows2[0].id,
        creationTime: rows2[0].creation_time,
        ...message,
        sender: {
          id: userId,
          name: rows3[0].name,
          nickname: rows3[0].nickname,
          imageUrl: rows3[0].image_url,
        },
        chatroomId,
      })
    )

    // Web Push 보내기
    if (receiverCount === 1) {
      const otherUserId = userIds.filter((chatroomUserId) => chatroomUserId !== userId)[0]
      const otherUserPushSubscription = await redisClient.get(`${otherUserId}:pushSubscription`)

      if (otherUserPushSubscription) {
        webpush.sendNotification(
          JSON.parse(otherUserPushSubscription),
          JSON.stringify({
            content: message.content,
            sender: {
              nickname: rows3[0].nickname,
              imageUrl: rows3[0].image_url,
            },
          })
        )
      }
    }

    reply.status(201).send()
  })

  const schema2 = {
    body: {
      type: 'object',
      properties: {
        pushSubscription: {
          type: 'object',
          properties: {
            endpoint: { type: 'string' },
            expirationTime: { type: 'number' },
            keys: {
              type: 'object',
              properties: {
                auth: { type: 'string' },
                p256dh: { type: 'string' },
              },
              additionalProperties: false,
              required: ['auth', 'p256dh'],
            },
          },
          additionalProperties: false,
          required: ['endpoint', 'expirationTime', 'keys'],
        },
      },
      additionalProperties: false,
      required: ['pushSubscription'],
    },
  } as const

  type Schema2 = { Body: FromSchema<typeof schema2.body> }

  fastify.post<Schema2>('/chat/push', { schema: schema2 }, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const logoutTime = await redisClient.set(
      `${userId}:pushSubscription`,
      JSON.stringify(request.body.pushSubscription)
    )
    if (logoutTime !== 'OK') throw ServiceUnavailableError('Redis unavailable error')

    reply.status(201).send('pushSubscription 생성 완료')
  })

  fastify.delete('/chat/push', async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const removedCount = await redisClient.del(`${userId}:pushSubscription`)
    if (removedCount !== 1) throw ServiceUnavailableError('Redis unavailable error')

    reply.status(204).send('pushSubscription 삭제 완료')
  })

  const schema3 = {
    body: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            type: { type: 'number' },
          },
          additionalProperties: false,
          required: ['content', 'type'],
        },
      },
      additionalProperties: false,
      required: ['message'],
    },
  } as const

  type Schema3 = { Body: FromSchema<typeof schema3.body> }

  fastify.post<Schema3>('/chat/test', { schema: schema3 }, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const pushSubscription = await redisClient.get(`${userId}:pushSubscription`)
    if (!pushSubscription) throw BadRequestError('pushSubscription 정보가 없습니다')

    const { message } = request.body

    const { rows } = await poolQuery<IMessageSenderResult>(messageSender, [userId])

    webpush.sendNotification(
      JSON.parse(pushSubscription),
      JSON.stringify({
        content: message.content,
        type: message.type,
        sender: {
          nickname: rows[0].nickname,
          imageUrl: rows[0].image_url,
        },
      })
    )

    reply.status(200).send()
  })
}
