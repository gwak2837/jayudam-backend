import { Type } from '@sinclair/typebox'

import { NODE_ENV } from '../../common/constants'
import { NotFoundError, UnauthorizedError } from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { ChatType, hideContent } from './object'
import { IChatroomResult } from './sql/chatroom'
import chatroom from './sql/chatroom.sql'
import { IChatroomsResult } from './sql/chatrooms'
import chatrooms from './sql/chatrooms.sql'
import { TFastify } from '..'

export default function chatQuery(fastify: TFastify) {
  const option = {
    schema: {
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            unreadCount: Type.Union([Type.String(), Type.Null()]),

            otherUser: Type.Object({
              name: Type.Union([Type.String(), Type.Null()]),
              nickname: Type.Union([Type.String(), Type.Null()]),
              imageUrl: Type.Union([Type.String(), Type.Null()]),
            }),

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
        unreadCount: row.chatroom__unread_count,
        otherUser: {
          name: row.user__name,
          nickname: row.user__nickname,
          imageUrl: row.user__image_url,
        },
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
      response: {
        200: Type.Object({
          data: Type.Array(
            Type.Object({
              id: Type.String(),
              creationTime: Type.String(),
              content: Type.String(),
              type: Type.Number(),

              user: Type.Object({
                id: Type.String(),
                name: Type.Union([Type.String(), Type.Null()]),
                nickname: Type.Union([Type.String(), Type.Null()]),
              }),
            })
          ),
          lastChatId: Type.String(),
        }),
      },
    },
  }

  fastify.get('/chatroom/:id', option2, async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rowCount, rows } = await poolQuery<IChatroomResult>(chatroom, [
      userId,
      request.params.id,
      request.query.lastChatId ?? Number.MAX_SAFE_INTEGER,
      messageLimit,
    ])

    if (rowCount === 0) throw NotFoundError('해당 대화방을 찾을 수 없습니다')

    return reply.status(200).send({
      data: rows.map((row) => ({
        id: row.id,
        creationTime: row.creation_time.toISOString(),
        content: row.content,
        type: row.type,
        user: {
          id: row.user__id,
          name: row.user__name,
          nickname: row.user__nickname,
        },
      })),
      lastChatId: rows[rowCount - 1].id,
    })
  })
}

const messageLimit = NODE_ENV === 'production' ? 30 : 3
