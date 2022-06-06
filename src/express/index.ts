import { type Express } from 'express'
import { setKakaoOAuthStrategies } from './oauth/kakao'
import { setNaverOAuthStrategies } from './oauth/naver'

export function setOAuthStrategies(app: Express) {
  setKakaoOAuthStrategies(app)
  setNaverOAuthStrategies(app)
}
