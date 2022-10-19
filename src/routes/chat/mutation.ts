import { Type } from '@sinclair/typebox'

import {
  ForbiddenError,
  NotFoundError,
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
import createChatroom from './sql/createChatroom.sql'
import deleteChatroom from './sql/deleteChatroom.sql'
import { TFastify } from '..'

import { ICreateChatroomResult } from './sql/createChatroom'
import { getFrontendUrl } from '../oauth'

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

  fastify.post('/chat', option, async (request, reply) => {
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
      `chatroom:${chatroomId}`,
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

    return reply.status(201).send()
  })

  const option3 = {
    schema: {
      querystring: Type.Object({
        otherUserId: Type.String(),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
        }),
      },
    },
  }

  fastify.post('/chatroom', option3, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rowCount, rows } = await poolQuery<ICreateChatroomResult>(createChatroom, [
      userId,
      request.query.otherUserId,
    ])

    const newChatroomId = rows[0].new_chatroom_id

    if (rowCount === 0) throw NotFoundError('해당 대화방을 찾을 수 없습니다')
    if (!newChatroomId) throw ServiceUnavailableError('다시 시도해주세요')

    const frontendUrl = getFrontendUrl(request.headers.referer)
    return reply.redirect(`${frontendUrl}/chatroom/${newChatroomId}`)
  })

  const option4 = {
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        204: Type.Object({
          id: Type.String(),
        }),
      },
    },
  }

  fastify.delete('/chatroom/:id', option4, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<ICreateChatroomResult>(deleteChatroom, [
      request.params.id,
      userId,
    ])

    const deletedChatroomId = rows[0].new_chatroom_id
    if (!deletedChatroomId) throw NotFoundError('해당 대화방을 찾을 수 없습니다')

    return reply.status(204).send({ id: deletedChatroomId })
  })
}
