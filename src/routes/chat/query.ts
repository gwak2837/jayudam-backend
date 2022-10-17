import { UnauthorizedError } from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { ChatType, hideContent } from './object'
import { IChatroomsResult } from './sql/chatrooms'
import chatrooms from './sql/chatrooms.sql'
import { TFastify } from '..'
import { Type } from '@sinclair/typebox'

export default function chatQuery(fastify: TFastify) {
  const option2 = {
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

  fastify.get('/chatroom', option2, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IChatroomsResult>(chatrooms, [userId])

    reply.status(200).send(
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

  const option3 = {
    schema: {
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          imageUrl: Type.Union([Type.String(), Type.Null()]),
        }),
      },
    },
  }

  fastify.get('/chatroom/:id', option3, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const id = request.params.id
  })
}
