import { Type } from '@sinclair/typebox'

import { BadRequestError, ServiceUnavailableError, UnauthorizedError } from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { redisClient } from '../../common/redis'
import webpush from '../../common/web-push'
import { getFrontendUrl } from '../oauth'
import { IMessageSenderResult } from './sql/messageSender'
import messageSender from './sql/messageSender.sql'
import { TFastify } from '..'

export default function pushMutation(fastify: TFastify) {
  const option2 = {
    schema: {
      body: Type.Object({
        pushSubscription: Type.Object({
          endpoint: Type.String(),
          keys: Type.Object({
            auth: Type.String(),
            p256dh: Type.String(),
          }),
        }),
      }),
      response: {
        201: Type.Object({
          message: Type.String(),
        }),
      },
    },
  }

  fastify.post('/push', option2, async (request, reply) => {
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

    reply.status(201).send({ message: 'pushSubscription 생성 완료' })
  })

  const option4 = {
    schema: {
      response: {
        204: Type.Object({
          message: Type.String(),
        }),
      },
    },
  }

  fastify.delete('/push', option4, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const removedCount = await redisClient.del(`${userId}:pushSubscription`)
    if (removedCount !== 1) throw ServiceUnavailableError('Redis unavailable error')

    reply.status(204).send({ message: 'pushSubscription 삭제 완료' })
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
        200: Type.Object({
          message: Type.String(),
        }),
        201: Type.Object({
          message: Type.String(),
        }),
      },
    },
  }

  fastify.post('/push/test', option3, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const pushSubscription = await redisClient.get(`${userId}:pushSubscription`)
    if (!pushSubscription) throw BadRequestError('pushSubscription 정보가 없습니다')

    const { message } = request.body

    const { rows } = await poolQuery<IMessageSenderResult>(messageSender, [userId])
    const sender = rows[0]

    const frontendUrl = getFrontendUrl(request.headers.referer)

    setTimeout(() => {
      webpush.sendNotification(
        JSON.parse(pushSubscription),
        JSON.stringify({
          content: message.content,
          type: message.type,
          chatroomId: '0',
          sender: {
            nickname: sender.nickname,
            imageUrl: sender.image_url,
          },
          url: `${frontendUrl}/chatroom/0`,
        })
      )
    }, 5_000)

    reply.status(201).send({ message: '웹 푸시 알림 테스트 중' })
  })
}
