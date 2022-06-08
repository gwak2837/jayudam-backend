import { type Express } from 'express'
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
