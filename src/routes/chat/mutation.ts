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
import { getFrontendUrl } from '../oauth'
import { ICreateChatResult } from './sql/createChat'
import createChat from './sql/createChat.sql'
import { ICreateChatroomResult } from './sql/createChatroom'
import createChatroom from './sql/createChatroom.sql'
import deleteChatroom from './sql/deleteChatroom.sql'
import { IIsMyChatroomResult } from './sql/isMyChatroom'
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
      response: {
        201: Type.Object({
          message: Type.String(),
        }),
      },
    },
  }

  fastify.post('/chat', option, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { chatroomId, message } = request.body

    const { rows } = await poolQuery<IIsMyChatroomResult>(isMyChatroom, [chatroomId])

    const userIds = rows.map((row) => row.user_id)
    if (!userIds.includes(userId)) throw ForbiddenError()

    const { rows: rows2 } = await poolQuery<ICreateChatResult>(createChat, [
      message.content,
      message.type,
      chatroomId,
      userId,
    ])
    const newChat = rows2[0]

    const { rows: rows3 } = await poolQuery<IMessageSenderResult>(messageSender, [userId])
    const sender = rows3[0]

    // HTTP/2 Push 보내기
    const receiverCount = await redisClient.publish(
      `chatroom:${chatroomId}`,
      JSON.stringify({
        id: newChat.id,
        creationTime: newChat.creation_time,
        ...message,
        chatroomId,
        sender: {
          id: userId,
          name: sender.name,
          nickname: sender.nickname,
          imageUrl: sender.image_url,
        },
      })
    )

    // Web Push 보내기
    if (receiverCount === 1) {
      const otherUserId = userIds.filter((chatroomUserId) => chatroomUserId !== userId)[0]
      const otherUserPushSubscription = await redisClient.get(`${otherUserId}:pushSubscription`)
      const frontendUrl = getFrontendUrl(request.headers.referer)

      if (otherUserPushSubscription) {
        webpush.sendNotification(
          JSON.parse(otherUserPushSubscription),
          JSON.stringify({
            content: message.content,
            type: message.type,
            chatroomId,
            sender: {
              nickname: sender.nickname,
              imageUrl: sender.image_url,
            },
            url: `${frontendUrl}/chatroom/${chatroomId}`,
          })
        )
      }
    }

    return reply.status(201).send({ message: '메시지 생성 완료' })
  })

  const option3 = {
    schema: {
      querystring: Type.Object({
        otherUserId: Type.String(),
      }),
      // response: {
      //   302: Type.Object({
      //     id: Type.String(),
      //   }),
      // },
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
