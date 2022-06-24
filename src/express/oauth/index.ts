import { Express } from 'express'

import { setBBatonOAuthStrategies } from './bbaton'
import { setGoogleOAuthStrategies } from './google'
import { setKakaoOAuthStrategies } from './kakao'
import { setNaverOAuthStrategies } from './naver'

export function setOAuthStrategies(app: Express) {
  setKakaoOAuthStrategies(app)
  setNaverOAuthStrategies(app)
  setBBatonOAuthStrategies(app)
  setGoogleOAuthStrategies(app)
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

const urlRegex = /^https:\/\/jayudam-[-a-z0-9]{1,50}-gwak2837\.vercel\.app\//

export function isValidFrontendUrl(url: string) {
  if (!url) return true
  if (url.startsWith('https://jayudam.app/')) return true
  if (url.startsWith('https://jayudam.vercel.app/')) return true
  if (url.match(urlRegex)) return true

  return false
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
