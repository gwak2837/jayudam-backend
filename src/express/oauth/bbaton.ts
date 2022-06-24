import { Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { bBatonClientId, bBatonClientSecretKey, frontendUrl } from '../../utils/constants'
import { generateJWT } from '../../utils/jwt'
import { IGetBBatonUserResult } from './sql/getBBatonUser'
import getBBatonUser from './sql/getBBatonUser.sql'
import { IRegisterBBatonUserResult } from './sql/registerBBatonUser'
import registerBBatonUser from './sql/registerBBatonUser.sql'
import { BBatonUser, BBatonUserToken, encodeSex, isValidFrontendUrl } from '.'

export function setBBatonOAuthStrategies(app: Express) {
  // https://bauth.bbaton.com/oauth/authorize?client_id=JDJhJDA0JHRqNmFYckhyZXBWVGlKLnFkNzUvTGV5VWYwVGdyTEdXLkpYUzFP&redirect_uri=http://localhost:4000/oauth/bbaton&response_type=code&scope=read_profile
  // BBaton 계정으로 가입하기
  // 필수 수집: BBaton 식별 번호, 성별, 성인여부, 연령대
  app.get('/oauth/bbaton', async (req, res) => {
    // request 검사
    const code = req.query.code as string
    const backendUrl = req.headers.host as string
    const referer = req.headers.referer as string
    if (!code || !backendUrl || !isValidFrontendUrl(referer))
      return res.status(400).send('Bad Request')

    // OAuth 사용자 정보 가져오기
    const bBatonUserToken = await fetchBBatonUserToken(code, backendUrl)
    if (bBatonUserToken.error) return res.status(400).send('Bad Request')

    const bBatonUser = await fetchBBatonUser(bBatonUserToken.access_token)
    if (bBatonUser.error) return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(referer)

    if (bBatonUser.adult_flag !== 'Y') return res.redirect(`${frontendUrl}/oauth?isAdult=false`)

    // 자유담 사용자 정보 가져오기
    const { rows: rows2 } = await poolQuery<IGetBBatonUserResult>(getBBatonUser, [
      bBatonUser.user_id,
    ])
    const jayudamUser = rows2[0]

    // 이미 소셜 로그인 정보가 존재하는 경우
    if (jayudamUser?.id) {
      const nickname = jayudamUser.nickname
      const querystring = new URLSearchParams({
        jwt: await generateJWT({ userId: jayudamUser.id }),
        ...(nickname && { nickname }),
      })
      return res.redirect(`${frontendUrl}/oauth?${querystring}`)
    }

    // 소셜 로그인 정보가 없는 경우
    const { rows } = await poolQuery<IRegisterBBatonUserResult>(registerBBatonUser, [
      null,
      null,
      null,
      null,
      null,
      encodeSex(bBatonUser.gender),
      null,
      null,
      bBatonUser.user_id,
    ])

    const querystring = new URLSearchParams({
      jwt: await generateJWT({ userId: rows[0].id }),
    })
    return res.redirect(`${frontendUrl}/oauth?${querystring}`)
  })
}

async function fetchBBatonUserToken(code: string, backendUrl: string) {
  const bBatonAuthString = `${bBatonClientId}:${bBatonClientSecretKey}`

  const response = await fetch('https://bauth.bbaton.com/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(bBatonAuthString).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: `${backendUrl}/oauth/bbaton`,
      code,
    }).toString(),
  })

  return response.json() as Promise<BBatonUserToken>
}

async function fetchBBatonUser(accessToken: string) {
  const response = await fetch('https://bapi.bbaton.com/v2/user/me', {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  })
  return response.json() as Promise<BBatonUser>
}

function getFrontendUrl(referer?: string) {
  switch (referer) {
    case 'https://accounts.bbaton.com/':
    case 'https://bauth.bbaton.com/':
    case undefined:
      return frontendUrl
    default:
      return referer.substring(0, referer?.length - 1)
  }
}
