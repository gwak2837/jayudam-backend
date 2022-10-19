import { NotFoundError, UnauthorizedError } from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { ChatType, hideContent } from './object'
import { IChatroomsResult } from './sql/chatrooms'
import chatrooms from './sql/chatrooms.sql'
import chatroom from './sql/chatroom.sql'
import { TFastify } from '..'
import { Type } from '@sinclair/typebox'
import { IChatroomResult } from './sql/chatroom'

export default function chatQuery(fastify: TFastify) {
  const option = {
    schema: {
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            name: Type.String(),
            imageUrl: Type.Union([Type.String(), Type.Null()]),
            unreadCount: Type.Union([Type.String(), Type.Null()]),

            lastChat: Type.Object({
              id: Type.Union([Type.String(), Type.Null()]),
              creationTime: Type.Union([Type.String(), Type.Null()]),
              content: Type.Union([Type.String(), Type.Null()]),
              type: Type.Union([Type.Enum(ChatType), Type.Null()]),
            }),
          })
        ),
      },
    },
  }

  fastify.get('/chatroom', option, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IChatroomsResult>(chatrooms, [userId])

    return reply.status(200).send(
      rows.map((row) => ({
        id: row.chatroom__id,
        name: row.chatroom__name,
        imageUrl: row.chatroom__image_url,
        unreadCount: row.chatroom__unread_count,
        lastChat: {
          id: row.chat__id,
          creationTime: row.chat__creation_time?.toISOString() ?? null,
          content: hideContent(row.chat__content, row.chat__type),
          type: row.chat__type,
        },
      }))
    )
  })

  const option2 = {
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      querystring: Type.Object({
        lastChatId: Type.Optional(Type.String()),
      }),
      // response: {
      //   200: Type.Array(Type.Object({})),
      // },
    },
  }

  fastify.get('/chatroom/:id', option2, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rowCount, rows } = await poolQuery<IChatroomResult>(chatroom, [
      userId,
      request.params.id,
      request.query.lastChatId,
      messageLimit,
    ])

    if (rowCount === 0) throw NotFoundError('해당 대화방을 찾을 수 없습니다')

    return reply.status(200).send(rows)
  })
}

const messageLimit = 30
