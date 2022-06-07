import { type Express } from 'express'
import { setBBatonOAuthStrategies } from './oauth/bbaton'
import { setGoogleOAuthStrategies } from './oauth/google'
import { setKakaoOAuthStrategies } from './oauth/kakao'
import { setNaverOAuthStrategies } from './oauth/naver'

export function setOAuthStrategies(app: Express) {
  setKakaoOAuthStrategies(app)
  setNaverOAuthStrategies(app)
  setBBatonOAuthStrategies(app)
  setGoogleOAuthStrategies(app)
}
