/* eslint-disable no-unused-vars */
import { Type } from '@sinclair/typebox'

enum ChatType {
  TEXT,
  IMAGE,
  GIF,
  EMOTICON,
  VIDEO,
}

export const Chatroom = Type.Object({
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

export const Chatrooms = Type.Array(Chatroom)

export function hideContent(content: string, type: ChatType) {
  switch (type) {
    case ChatType.TEXT:
      return content
    case ChatType.IMAGE:
      return '이미지를 보냈습니다'
    case ChatType.GIF:
      return 'GIF를 보냈습니다'
    case ChatType.EMOTICON:
      return '이모티콘을 보냈습니다'
    case ChatType.VIDEO:
      return '동영상을 보냈습니다'
    default:
      return null
  }
}
