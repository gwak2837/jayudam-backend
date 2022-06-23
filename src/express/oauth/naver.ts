import { Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { frontendUrl, naverClientId, naverClientSecret } from '../../utils/constants'
import { generateJWT } from '../../utils/jwt'
import { IGetNaverUserResult } from './sql/getNaverUser'
import getNaverUser from './sql/getNaverUser.sql'
import { IRegisterNaverUserResult } from './sql/registerNaverUser'
import registerNaverUser from './sql/registerNaverUser.sql'
import { isValidFrontendUrl } from '.'

export function setNaverOAuthStrategies(app: Express) {
  // https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=FPQoCRnHgbAWgjWYtlLb&redirect_uri=http://localhost:4000/oauth/naver&state=123
  // 필수 수집: 네이버 식별 번호, 성별, 출생년도
  // 선택 수집: 닉네임, 프로필 사진, 이메일, 출생월일, 전화번호
  app.get('/oauth/naver', async (req, res) => {
    const code = req.query.code as string
    const backendUrl = req.headers.host as string
    const state = req.query.state as string
    if (!code || !backendUrl || !state) return res.status(400).send('Bad Request')

    const naverUserToken = await fetchNaverUserToken(code, backendUrl, state)
    if (naverUserToken.error) return res.status(400).send('Bad Request')

    const naverUserInfo = await fetchNaverUserInfo(naverUserToken.access_token)
    if (naverUserInfo.resultcode !== '00') return res.status(400).send('Bad Request')

    const referer = req.headers.referer as string
    if (!isValidFrontendUrl(referer)) return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(referer)
    const naverAccount = naverUserInfo.response
    console.log('👀 - req.headers.referer', req.headers.referer)

    const { rows: naverUserResult } = await poolQuery<IGetNaverUserResult>(getNaverUser, [
      naverAccount.id,
    ])
    const naverUser = naverUserResult[0]

    // 이미 소셜 로그인 정보가 존재하는 경우
    if (naverUser?.id) {
      const nickname = naverUser.nickname
      return res.redirect(
        `${frontendUrl}/oauth?${new URLSearchParams({
          jwt: await generateJWT({ userId: naverUser.id }),
          ...(nickname && { nickname }),
        })}`
      )
    }

    // 소셜 로그인 정보가 없는 경우
    return res.status(401).send('The account associated with the Naver account does not exist.')
  })

  app.get('/oauth/naver/unregister', async (req, res) => {
    console.log('👀 - req.query.user_id', req.query.user_id)
    console.log('👀 - req.query.referrer_type', req.query.referrer_type)
  })
}

async function fetchNaverUserToken(code: string, backendUrl: string, state: string) {
  const response = await fetch(
    `https://nid.naver.com/oauth2.0/token?${new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: naverClientId,
      client_secret: naverClientSecret,
      code,
      redirect_uri: `${backendUrl}/oauth/naver`,
      state,
    })}`,
    {
      headers: {
        'X-Naver-Client-Id': naverClientId,
        'X-Naver-Client-Secret': naverClientSecret,
      },
    }
  )

  return response.json() as Promise<Record<string, any>>
}

async function fetchNaverUserInfo(accessToken: string) {
  const response = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.json() as Promise<Record<string, any>>
}

function getFrontendUrl(referer?: string) {
  switch (referer) {
    case 'https://naver.com/':
    case 'https://nid.naver.com/':
    case undefined:
      return frontendUrl
    default:
      return referer.substring(0, referer?.length - 1)
  }
}

function encodeBirthDay(birthday: string) {
  return birthday.replace('-', '')
}

export function encodeSex(sex: string) {
  switch (sex) {
    case 'M':
      return 1
    case 'F':
      return 2
    default:
      return 0
  }
}
