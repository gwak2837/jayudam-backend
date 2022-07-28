import { Express } from 'express'

import { FRONTEND_URL } from '../../utils/constants'
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

export function getFrontendUrl(referer?: string) {
  console.log('👀 - referer', referer)
  switch (referer) {
    case 'http://localhost:3000/':
    case 'https://jayudam.app/':
    case 'https://jayudam.vercel.app/':
      return referer.substring(0, referer.length - 1)
    case 'https://accounts.bbaton.com/':
    case 'https://bauth.bbaton.com/':
    case 'http://bauth.bbaton.com/':
    case 'https://accounts.kakao.com/':
    case 'https://kauth.kakao.com/':
    case 'https://naver.com/':
    case 'https://nid.naver.com/':
    case 'https://googleapis.com/':
    case undefined:
      return FRONTEND_URL
  }

  // dev, feature, fix 브랜치 배포 주소
  if (referer.match(urlRegex)) return referer.substring(0, referer.length - 1)
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
