import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { redisClient } from '../../database/redis'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../utils/constants'
import { signJWT, verifyJWT } from '../../utils/jwt'
import type { IGetGoogleUserResult } from './sql/getGoogleUser'
import getGoogleUser from './sql/getGoogleUser.sql'
import type { IGetUserResult } from './sql/getUser'
import getUser from './sql/getUser.sql'
import type { IUpdateGoogleUserResult } from './sql/updateGoogleUser'
import updateGoogleUser from './sql/updateGoogleUser.sql'
import {
  getFrontendUrl,
  querystringCode,
  QuerystringCode,
  querystringCodeState,
  QuerystringCodeState,
} from '.'
import { FastifyHttp2 } from '../../fastify/server'

export function setGoogleOAuthStrategies(app: FastifyHttp2) {
  // Google 계정으로 로그인하기
  app.get<QuerystringCode>('/oauth/google', querystringCode, async (req, res) => {
    const code = req.query.code
    const backendUrl = req.headers.host
    if (!backendUrl) return res.status(400).send('Bad Request')

    // OAuth 사용자 정보 가져오기
    const googleUserToken = await fetchGoogleUserToken(code, `${req.protocol}://${backendUrl}`)
    if (googleUserToken.error) return res.status(400).send('Bad Request')

    const googleUser = await fetchGoogleUser(googleUserToken.access_token)
    if (googleUser.error) return res.status(400).send('Bad Request')

    // 자유담 사용자 정보 가져오기
    const { rowCount, rows } = await poolQuery<IGetGoogleUserResult>(getGoogleUser, [googleUser.id])
    const jayudamUser = rows[0]

    const frontendUrl = getFrontendUrl(req.headers.referer)

    // 소셜 로그인 정보가 없는 경우
    if (rowCount === 0)
      return res.redirect(`${frontendUrl}/oauth?isAlreadyAssociatedWithOAuth=false&oauth=google`)

    // 정지된 계정인 경우
    if (jayudamUser.blocking_start_time)
      return res.redirect(
        `${frontendUrl}/oauth?isBlocked=true&from=${jayudamUser.blocking_start_time}&to=${jayudamUser.blocking_end_time}`
      )

    // 휴먼 계정인 경우
    if (jayudamUser.sleeping_time)
      return res.redirect(
        `${frontendUrl}/oauth?hasBeenSleeping=true&since=${jayudamUser.sleeping_time}`
      )

    // OAuth 사용자 정보와 자유담 사용자 정보 비교
    if (jayudamUser.legal_name && jayudamUser.legal_name !== googleUser.name)
      return res.redirect(`${frontendUrl}/oauth?jayudamUserMatchWithOAuthUser=false&oauth=google`)

    // 소셜 로그인 정보가 존재하는 경우
    const querystring = new URLSearchParams({
      jwt: await signJWT({ userId: jayudamUser.id }),
      ...(jayudamUser.name && { username: jayudamUser.name }),
    })
    return res.redirect(`${frontendUrl}/oauth?${querystring}`)
  })

  // Google 계정 연결하기
  app.get<QuerystringCodeState>(
    '/oauth/google/register',
    querystringCodeState,
    async (req, res) => {
      const code = req.query.code
      const backendUrl = req.headers.host
      const jwt = req.query.state
      if (!backendUrl) return res.status(400).send('Bad Request')

      const frontendUrl = getFrontendUrl(req.headers.referer)

      // JWT 유효성 검사
      const verifiedJwt = await verifyJWT(jwt)
      if (!verifiedJwt.iat) return res.status(401).send('Not Unauthorized')

      const logoutTime = await redisClient.get(`${verifiedJwt.userId}:logoutTime`)
      if (Number(logoutTime) > Number(verifiedJwt.iat))
        return res.redirect(`${frontendUrl}/oauth?doesJWTExpired=true`)

      // OAuth 사용자 정보 가져오기
      const [{ rowCount, rows: userResult }, googleUser] = await Promise.all([
        poolQuery<IGetUserResult>(getUser, [verifiedJwt.userId]),
        fetchFromGoogle(code, `${req.protocol}://${backendUrl}`),
      ])
      if (rowCount === 0 || googleUser.error) return res.status(400).send('Bad Request') // user가 존재하지 않으면 JWT secret key가 유출됐다는 뜻

      const jayudamUser = userResult[0]

      // 이미 OAuth 연결되어 있으면
      if (jayudamUser.oauth_google)
        return res.redirect(`${frontendUrl}/oauth?isAlreadyAssociatedWithOAuth=true&oauth=google`)

      // OAuth 사용자 정보와 자유담 사용자 정보 비교
      if (jayudamUser.legal_name && jayudamUser.legal_name !== googleUser.name)
        return res.redirect(`${frontendUrl}/oauth?jayudamUserMatchWithOAuthUser=false&oauth=google`)

      await poolQuery<IUpdateGoogleUserResult>(updateGoogleUser, [
        jayudamUser.id,
        googleUser.email,
        googleUser.picture ? [googleUser.picture] : null,
        googleUser.id,
      ])

      return res.redirect(
        `${frontendUrl}/oauth?${new URLSearchParams({
          jwt: await signJWT({ userId: jayudamUser.id }),
          ...(jayudamUser.name && { username: jayudamUser.name }),
        })}`
      )
    }
  )
}

async function fetchFromGoogle(code: string, backendUrl: string) {
  const googleUserToken = await fetchGoogleUserToken(code, backendUrl)
  if (googleUserToken.error) return { error: true }

  const googleUserInfo = await fetchGoogleUser(googleUserToken.access_token)
  if (googleUserInfo.error) return { error: true }

  return googleUserInfo
}

async function fetchGoogleUserToken(code: string, backendUrl: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${backendUrl}/oauth/google`,
      grant_type: 'authorization_code',
    }).toString(),
  })

  return response.json() as Promise<Record<string, any>>
}

async function fetchGoogleUser(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.json() as Promise<Record<string, any>>
}
