import { FastifySchema } from 'fastify'

import { poolQuery } from '../../common/postgres'
import { redisClient } from '../../common/redis'
import webpush from '../../common/web-push'
import {
  BadRequestError,
  ForbiddenError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '../../fastify/errors'
import { ICreateChatResult } from './sql/createChat'
import createChat from './sql/createChat.sql'
import isMyChatroom from './sql/isMyChatroom.sql'
import { IMessageSenderResult } from './sql/messageSender'
import messageSender from './sql/messageSender.sql'
import { FastifyHttp2 } from '..'

export default function setChatMutation(fastify: FastifyHttp2) {
  type Schema = {
    Body: {
      chatroomId: string
      message: {
        content: string
        type: number
      }
    }
  }

  const schema: FastifySchema = {
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
        },
      },
      required: ['chatroomId', 'message'],
    },
  }

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

  type Schema2 = {
    Body: {
      pushSubscription: {
        endpoint: string
        expirationTime: number
        keys: {
          auth: string
          p256dh: string
        }
      }
    }
  }

  const schema2: FastifySchema = {
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
            },
          },
        },
      },
      required: ['pushSubscription'],
    },
  }

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

  const schema3: FastifySchema = {
    body: {
      type: 'object',
      properties: {
        message: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            type: { type: 'number' },
          },
        },
      },
      required: ['message'],
    },
  }

  type Schema3 = {
    Body: {
      message: {
        content: string
        type: number
      }
    }
  }

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
        sender: {
          nickname: rows[0].nickname,
          imageUrl: rows[0].image_url,
        },
      })
    )

    reply.status(200).send()
  })
}
