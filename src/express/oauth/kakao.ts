import { type Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { kakaoAdminKey, kakaoClientSecret, kakaoRestApiKey } from '../../utils/constants'
import { generateJWT } from '../../utils/jwt'
import { IFindKakaoUserResult } from './sql/findKakaoUser'
import findKakaoUser from './sql/findKakaoUser.sql'
import { IRegisterKakaoUserResult } from './sql/registerKakaoUser'
import registerKakaoUser from './sql/registerKakaoUser.sql'

export function setKakaoOAuthStrategies(app: Express) {
  // https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=fa17772ea56b216e0fd949141f5ed5e2&redirect_uri=http://localhost:4000/oauth/kakao
  app.get('/oauth/kakao', async (req, res) => {
    if (!req.query.code) {
      return res.status(400).send('400 Bad Request')
    }

    const kakaoUserToken = await fetchKakaoUserToken(req.query.code as string)
    if (kakaoUserToken.error) {
      return res.status(400).send('400 Bad Request')
    }

    const kakaoUserInfo = await fetchKakaoUserInfo(kakaoUserToken.access_token)
    const kakaoAccount = kakaoUserInfo.kakao_account
    const referer = req.headers.referer
    const frontendUrl = getFrontendUrl(referer)

    // 선택항목 미동의 시 다른 페이지로 리다이렉트 하기
    if (!kakaoAccount.birthyear || !kakaoAccount.birthday || !kakaoAccount.gender) {
      unregisterKakaoUser(kakaoUserInfo.id)
      return res.redirect(`${frontendUrl}/need-info`)
    }

    const findKakaoUserResult = await poolQuery<IFindKakaoUserResult>(findKakaoUser, [
      kakaoUserInfo.id,
    ])
    const kakaoUser = findKakaoUserResult.rows[0]

    // 이미 Kakao 소셜 로그인 정보가 존재하는 경우
    if (kakaoUser?.id) {
      return res.redirect(
        `${frontendUrl}/oauth?${new URLSearchParams({
          jwt: await generateJWT({ userId: kakaoUser.id }),
          nickname: kakaoUser.nickname,
        } as any)}`
      )
    }

    // Kakao 소셜 로그인 정보가 없는 경우
    const { rows } = await poolQuery<IRegisterKakaoUserResult>(registerKakaoUser, [
      kakaoAccount.email,
      kakaoAccount.profile.nickname,
      kakaoAccount.phone_number,
      kakaoAccount.birthyear,
      kakaoAccount.birthday,
      encodeGender(kakaoAccount.gender),
      '소개가 아직 없어요.',
      kakaoAccount.profile.profile_image_url,
      kakaoUserInfo.id,
    ])

    return res.redirect(
      `${frontendUrl}/oauth?${new URLSearchParams({
        jwt: await generateJWT({ userId: rows[0].id }),
      })}`
    )
  })

  app.get('/oauth/kakao/unregister', async (req, res) => {
    if (req.headers.Authorization !== kakaoAdminKey) {
      return res.status(400).send('400 Bad Request')
    }

    console.log('👀 - req.query.user_id', req.query.user_id)
    console.log('👀 - req.query.referrer_type', req.query.referrer_type)
  })
}

function encodeGender(gender: string) {
  switch (gender) {
    case 'male':
      return 1
    case 'female':
      return 2
    default:
      return 0
  }
}

function getFrontendUrl(referer?: string) {
  switch (referer) {
    case 'https://accounts.kakao.com/':
    case 'https://kauth.kakao.com/':
    case undefined:
      return process.env.FRONTEND_URL
    default:
      return referer.substring(0, referer?.length - 1)
  }
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
