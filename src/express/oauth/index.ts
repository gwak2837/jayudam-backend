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

export type BBatonUserInfo = {
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
  if (url.startsWith('https://jayudam.app/')) return true
  if (url.startsWith('https://jayudam.vercel.app/')) return true
  if (url.match(urlRegex)) return true

  return false
}
