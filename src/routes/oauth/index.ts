import { FRONTEND_URL } from '../../common/constants'
import { setBBatonOAuthStrategies } from './bbaton'
import { setGoogleOAuthStrategies } from './google'
import { setKakaoOAuthStrategies } from './kakao'
import { setNaverOAuthStrategies } from './naver'
import { FastifyHttp2 } from '..'

export function setOAuthStrategies(app: FastifyHttp2) {
  setBBatonOAuthStrategies(app)
  setGoogleOAuthStrategies(app)
  setKakaoOAuthStrategies(app)
  setNaverOAuthStrategies(app)
}

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

export type QuerystringCode = {
  Querystring: {
    code: string
  }
}

export type QuerystringCodeState = {
  Querystring: {
    code: string
    state: string
  }
}

export const querystringCode = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        code: { type: 'string' },
      },
      required: ['code'],
    },
  },
}

export const querystringCodeState = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        state: { type: 'string' },
      },
      required: ['code', 'state'],
    },
  },
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
