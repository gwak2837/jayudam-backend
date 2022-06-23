import { Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import {
  frontendUrl,
  kakaoAdminKey,
  kakaoClientSecret,
  kakaoRestApiKey,
} from '../../utils/constants'
import { generateJWT } from '../../utils/jwt'
import { IGetKakaoUserResult } from './sql/getKakaoUser'
import getKakaoUser from './sql/getKakaoUser.sql'
import { IRegisterKakaoUserResult } from './sql/registerKakaoUser'
import registerKakaoUser from './sql/registerKakaoUser.sql'
import { isValidFrontendUrl } from '.'

export function setKakaoOAuthStrategies(app: Express) {
  // https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=fa17772ea56b216e0fd949141f5ed5e2&redirect_uri=http://localhost:4000/oauth/kakao
  // 필수 수집: 카카오 식별 번호, 성별, 출생년도
  // 선택 수집: 닉네임, 프로필 사진, 이메일, 출생월일, 전화번호
  app.get('/oauth/kakao', async (req, res) => {
    const code = req.query.code
    if (!code) return res.status(400).send('Bad Request')

    const kakaoUserToken = await fetchKakaoUserToken(code as string)
    if (kakaoUserToken.error) return res.status(400).send('Bad Request')

    const kakaoUserInfo = await fetchKakaoUserInfo(kakaoUserToken.access_token)
    if (!kakaoUserInfo.id) return res.status(400).send('Bad Request')

    const referer = req.headers.referer as string
    if (!isValidFrontendUrl(referer)) return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(referer)
    const kakaoAccount = kakaoUserInfo.kakao_account

    const findKakaoUserResult = await poolQuery<IGetKakaoUserResult>(getKakaoUser, [
      kakaoUserInfo.id,
    ])
    const kakaoUser = findKakaoUserResult.rows[0]

    // 이미 소셜 로그인 정보가 존재하는 경우
    if (kakaoUser?.id) {
      const nickname = kakaoUser.nickname
      return res.redirect(
        `${frontendUrl}/oauth?${new URLSearchParams({
          jwt: await generateJWT({ userId: kakaoUser.id }),
          ...(nickname && { nickname }),
        })}`
      )
    }

    // 소셜 로그인 정보가 없는 경우
    return res.status(401).send('The account associated with the Kakao account does not exist.')
  })

  app.get('/oauth/kakao/unregister', async (req, res) => {
    if (req.headers.Authorization !== kakaoAdminKey) {
      return res.status(400).send('400 Bad Request')
    }

    console.log('👀 - req.query.user_id', req.query.user_id)
    console.log('👀 - req.query.referrer_type', req.query.referrer_type)
  })
}

async function fetchKakaoUserToken(code: string) {
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: kakaoRestApiKey,
      code,
      client_secret: kakaoClientSecret,
    }).toString(),
  })

  return response.json() as Promise<Record<string, any>>
}

async function fetchKakaoUserInfo(accessToken: string) {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.json() as Promise<Record<string, any>>
}

function getFrontendUrl(referer?: string) {
  switch (referer) {
    case 'https://accounts.kakao.com/':
    case 'https://kauth.kakao.com/':
    case undefined:
      return frontendUrl
    default:
      return referer.substring(0, referer?.length - 1)
  }
}

function encodeSex(sex: string) {
  switch (sex) {
    case 'male':
      return 1
    case 'female':
      return 2
    default:
      return 0
  }
}

export async function unregisterKakaoUser(kakaoUserId: string) {
  return fetch('https://kapi.kakao.com/v1/user/unlink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `KakaoAK ${kakaoAdminKey}`,
    },
    body: new URLSearchParams({
      target_id_type: 'user_id',
      target_id: kakaoUserId,
    }).toString(),
  })
}
