import { Type } from '@sinclair/typebox'

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
import { TFastify } from '..'

export default function chatMutation(fastify: TFastify) {
  const option = {
    schema: {
      body: Type.Object({
        chatroomId: Type.String(),
        message: Type.Object({
          content: Type.String(),
          type: Type.Number(),
        }),
      }),
    },
  }

  fastify.post('/chat/send', option, async (request, reply) => {
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

  const option2 = {
    schema: {
      body: Type.Object({
        pushSubscription: Type.Object({
          endpoint: Type.String(),
          expirationTime: Type.Number(),
          keys: Type.Object({
            auth: Type.String(),
            p256dh: Type.String(),
          }),
        }),
      }),
      response: {
        201: Type.String(),
      },
    },
  }

  fastify.post('/chat/push', option2, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const pushSubscription = await redisClient.set(
      `${userId}:pushSubscription`,
      JSON.stringify({
        ...request.body.pushSubscription,
        expirationTime: Date.now() + 3_600_000,
      })
    )
    if (pushSubscription !== 'OK') throw ServiceUnavailableError('Redis unavailable error')

    reply.status(201).send('pushSubscription 생성 완료')
  })

  const option4 = {
    schema: {
      response: {
        204: Type.String(),
      },
    },
  }

  fastify.delete('/chat/push', option4, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const removedCount = await redisClient.del(`${userId}:pushSubscription`)
    if (removedCount !== 1) throw ServiceUnavailableError('Redis unavailable error')

    reply.status(204).send('pushSubscription 삭제 완료')
  })

  const option3 = {
    schema: {
      body: Type.Object({
        message: Type.Object({
          content: Type.String(),
          type: Type.Number(),
        }),
      }),
      response: {
        200: Type.String(),
      },
    },
  }

  fastify.post('/chat/test', option3, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const pushSubscription = await redisClient.get(`${userId}:pushSubscription`)
    if (!pushSubscription) throw BadRequestError('pushSubscription 정보가 없습니다')

    const { message } = request.body

    const { rows } = await poolQuery<IMessageSenderResult>(messageSender, [userId])

    setTimeout(() => {
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

      reply.status(200).send('웹 푸시 알림 테스트')
    }, 10_000)
  })
}
