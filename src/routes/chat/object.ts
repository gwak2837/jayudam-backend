/* eslint-disable no-unused-vars */

export enum ChatType {
  TEXT,
  IMAGE,
  GIF,
  EMOTICON,
  VIDEO,
}

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
