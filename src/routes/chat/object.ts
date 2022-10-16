import { Type } from '@sinclair/typebox'

export const Chatroom = Type.Object({
  chatroom__id: Type.String(),
  chatroom__name: Type.String(),
  chatroom__image_url: Type.Union([Type.String(), Type.Null()]),
  chatroom__unread_count: Type.Union([Type.String(), Type.Null()]),
  chat__id: Type.String(),
  chat__creation_time: Type.String(),
  chat__content: Type.String(),
  chat__type: Type.String(),
})

export const Chatrooms = Type.Array(Chatroom)
