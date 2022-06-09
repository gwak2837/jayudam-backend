import { type Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import {
  googleClientId,
  googleClientSecretKey,
  frontendUrl,
  backendUrl,
} from '../../utils/constants'
import { generateJWT } from '../../utils/jwt'
import { encodeSex } from './naver'
import { IGetGoogleUserResult } from './sql/getGoogleUser'
import getGoogleUser from './sql/getGoogleUser.sql'
import { IRegisterGoogleUserResult } from './sql/registerGoogleUser'
import registerGoogleUser from './sql/registerGoogleUser.sql'

export function setGoogleOAuthStrategies(app: Express) {
  // https://accounts.google.com/o/oauth2/v2/auth?client_id=289678734309-fd454q2i8b65ud4fjsm6tq7r7vab3d1v.apps.googleusercontent.com&redirect_uri=http://localhost:4000/oauth/google&response_type=code&scope=email+profile+openid
  // 필수 수집: Google 식별 번호
  // 선택 수집: 이메일, 이름, 프로필 사진, 로케일
  app.get('/oauth/google', async (req, res) => {
    const code = req.query.code
    if (!code) return res.status(400).send('Bad Request')

    const googleUserToken = await fetchGoogleUserToken(code as string)
    if (googleUserToken.error) return res.status(400).send('Bad Request')

    const googleUserInfo = await fetchGoogleUserInfo(googleUserToken.access_token)
    if (googleUserInfo.error) return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(req.headers.referer)

    const { rows: googleUserResult } = await poolQuery<IGetGoogleUserResult>(getGoogleUser, [
      googleUserInfo.id,
    ])
    const googleUser = googleUserResult[0]

    // 이미 소셜 로그인 정보가 존재하는 경우
    if (googleUser?.id) {
      const nickname = googleUser.nickname

      return res.redirect(
        `${frontendUrl}/oauth?${new URLSearchParams({
          jwt: await generateJWT({ userId: googleUser.id }),
          ...(nickname && { nickname }),
        })}`
      )
    }

    // 소셜 로그인 정보가 없는 경우
    return res.status(400).send('Bad Request')
  })
}

async function fetchGoogleUserToken(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecretKey,
      redirect_uri: `${backendUrl}/oauth/google`,
      grant_type: 'authorization_code',
    }).toString(),
  })

  return response.json() as Promise<Record<string, any>>
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.json() as Promise<Record<string, any>>
}

function getFrontendUrl(referer?: string) {
  switch (referer) {
    case 'https://com/':
    case 'https://googleapis.com/':
    case undefined:
      return frontendUrl
    default:
      return referer.substring(0, referer?.length - 1)
  }
}
