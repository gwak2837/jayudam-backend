import { FromSchema } from 'json-schema-to-ts'

import { FRONTEND_URL } from '../../common/constants'

export type BBatonUserToken = {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  error?: string
}

export type BBatonUser = {
  user_id: string
  adult_flag: string
  birth_year: string
  gender: string
  income: string
  student: string
  result_code: string
  result_message: string
  error?: string
}

export const querystringCode = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        code: { type: 'string' },
      },
      additionalProperties: false,
      required: ['code'],
    },
  },
} as const

export type QuerystringCode = {
  Querystring: FromSchema<typeof querystringCode.schema.querystring>
}

export const querystringCodeState = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        state: { type: 'string' },
      },
      additionalProperties: false,
      required: ['code', 'state'],
    },
  },
} as const

export type QuerystringCodeState = {
  Querystring: FromSchema<typeof querystringCodeState.schema.querystring>
}

const vercelURLRegEx = /^https:\/\/jayudam-[-a-z0-9]{1,20}-gwak2837\.vercel\.app\//

export function getFrontendUrl(referer?: string) {
  if (!referer) return FRONTEND_URL

  // dev, feature, fix 브랜치 배포 주소
  if (referer.match(vercelURLRegEx)) return referer.substring(0, referer.length - 1)

  switch (referer) {
    case 'http://localhost:3000/':
    case 'https://jayudam.app/':
    case 'https://jayudam.vercel.app/':
      return referer.substring(0, referer.length - 1)
    default:
      return FRONTEND_URL
  }
}

export function encodeSex(sex: string) {
  switch (sex) {
    case 'M':
    case 'male':
      return 1
    case 'F':
    case 'female':
      return 2
    default:
      return 0
  }
}
