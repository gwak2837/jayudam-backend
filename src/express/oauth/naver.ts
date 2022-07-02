import { Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { redisClient } from '../../database/redis'
import { FRONTEND_URL, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '../../utils/constants'
import { generateJWT, verifyJWT } from '../../utils/jwt'
import { IGetNaverUserResult } from './sql/getNaverUser'
import getNaverUser from './sql/getNaverUser.sql'
import { IGetUserResult } from './sql/getUser'
import getUser from './sql/getUser.sql'
import { IUpdateNaverUserResult } from './sql/updateNaverUser'
import updateNaverUser from './sql/updateNaverUser.sql'
import { encodeSex, isValidFrontendUrl } from '.'

export function setNaverOAuthStrategies(app: Express) {
  // Naver 계정으로 로그인하기
  app.get('/oauth/naver', async (req, res) => {
    // 입력값 검사
    const code = req.query.code as string
    const backendUrl = req.headers.host as string
    const state = req.query.state as string
    const referer = req.headers.referer as string
    if (!code || !backendUrl || !state || !isValidFrontendUrl(referer))
      return res.status(400).send('Bad Request')

    // OAuth 사용자 정보 가져오기
    const naverUserToken = await fetchNaverUserToken(code, `${req.protocol}://${backendUrl}`, state)
    if (naverUserToken.error) return res.status(400).send('Bad Request')

    const naverUser2 = await fetchNaverUser(naverUserToken.access_token)
    if (naverUser2.resultcode !== '00') return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(referer)
    const naverUser = naverUser2.response

    // 자유담 사용자 정보 가져오기
    const { rowCount, rows } = await poolQuery<IGetNaverUserResult>(getNaverUser, [naverUser.id])
    const jayudamUser = rows[0]

    // 소셜 로그인 정보가 없는 경우
    if (rowCount === 0)
      return res.redirect(`${frontendUrl}/oauth?isAlreadyAssociatedWithOAuth=false&oauth=naver`)

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
    if (
      jayudamUser.sex !== encodeSex(naverUser.gender) ||
      (jayudamUser.name && jayudamUser.name !== naverUser.name) ||
      (jayudamUser.birthyear && jayudamUser.birthyear !== naverUser.birthyear) ||
      (jayudamUser.birthday && jayudamUser.birthday !== encodeBirthDay(naverUser.birthday)) ||
      (jayudamUser.phone_number && jayudamUser.phone_number !== naverUser.mobile)
    )
      return res.redirect(`${frontendUrl}/oauth?jayudamUserMatchWithOAuthUser=false&oauth=naver`)

    // 소셜 로그인 정보가 존재하는 경우
    const nickname = jayudamUser.nickname
    return res.redirect(
      `${frontendUrl}/oauth?${new URLSearchParams({
        jwt: await generateJWT({ userId: jayudamUser.id }),
        ...(nickname && { nickname }),
      })}`
    )
  })

  // https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=FPQoCRnHgbAWgjWYtlLb&redirect_uri=http://localhost:4000/oauth/naver/register&state=jwt
  // Naver 계정 연결하기
  app.get('/oauth/google/register', async (req, res) => {
    // 입력값 검사
    const code = req.query.code as string
    const backendUrl = req.headers.host as string
    const jwt = req.query.state as string
    const referer = req.headers.referer as string
    if (!code || !backendUrl || !jwt || !isValidFrontendUrl(referer))
      return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(referer)

    // JWT 유효성 검사
    const verifiedJwt = await verifyJWT(jwt)
    if (!verifiedJwt.iat) return res.status(401).send('Not Unauthorized')

    const logoutTime = await redisClient.get(`${verifiedJwt.userId}:logoutTime`)
    if (Number(logoutTime) > Number(verifiedJwt.iat))
      return res.redirect(`${frontendUrl}/oauth?doesJWTExpired=true`)

    // 자유담 사용자 정보, OAuth 사용자 정보 가져오기
    const [{ rowCount, rows: userResult }, naverUser] = await Promise.all([
      poolQuery<IGetUserResult>(getUser, [verifiedJwt.userId]),
      fetchFromNaver(code, backendUrl, jwt),
    ])
    if (rowCount === 0 || naverUser.error) return res.status(400).send('Bad Request') // user가 존재하지 않으면 JWT secret key가 유출됐다는 뜻

    const jayudamUser = userResult[0]

    // 이미 OAuth 연결되어 있으면
    if (jayudamUser.oauth_naver)
      return res.redirect(`${frontendUrl}/oauth?isAlreadyAssociatedWithOAuth=true&oauth=naver`)

    // OAuth 사용자 정보와 자유담 사용자 정보 비교
    if (
      jayudamUser.sex !== encodeSex(naverUser.gender) ||
      (jayudamUser.name && jayudamUser.name !== naverUser.name) ||
      (jayudamUser.birthyear && jayudamUser.birthyear !== naverUser.birthyear) ||
      (jayudamUser.birthday && jayudamUser.birthday !== encodeBirthDay(naverUser.birthday)) ||
      (jayudamUser.phone_number && jayudamUser.phone_number !== naverUser.mobile)
    )
      return res.redirect(`${frontendUrl}/oauth?jayudamUserMatchWithOAuthUser=false&oauth=naver`)

    await poolQuery<IUpdateNaverUserResult>(updateNaverUser, [
      jayudamUser.id,
      naverUser.email,
      naverUser.profile_image ? [naverUser.profile_image] : null,
      naverUser.id,
    ])

    return res.redirect(
      `${frontendUrl}/oauth?${new URLSearchParams({
        jwt: await generateJWT({ userId: jayudamUser.id }),
        ...(jayudamUser.nickname && { nickname: jayudamUser.nickname }),
      })}`
    )
  })
}

async function fetchFromNaver(code: string, backendUrl: string, state: string) {
  const naverUserToken = await fetchNaverUserToken(code, backendUrl, state)
  if (naverUserToken.error) return { error: true }

  const naverUser = await fetchNaverUser(naverUserToken.access_token)
  if (naverUser.error) return { error: true }

  return naverUser
}

async function fetchNaverUserToken(code: string, backendUrl: string, state: string) {
  const response = await fetch(
    `https://nid.naver.com/oauth2.0/token?${new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: NAVER_CLIENT_ID,
      client_secret: NAVER_CLIENT_SECRET,
      code,
      redirect_uri: `${backendUrl}/oauth/naver`,
      state,
    })}`,
    {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    }
  )

  return response.json() as Promise<Record<string, any>>
}

async function fetchNaverUser(accessToken: string) {
  const response = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.json() as Promise<Record<string, any>>
}

function getFrontendUrl(referer?: string) {
  console.log('👀 - referer', referer)
  switch (referer) {
    case 'https://naver.com/':
    case 'https://nid.naver.com/':
    case undefined:
      return FRONTEND_URL
    default:
      return referer.substring(0, referer?.length - 1)
  }
}

function encodeBirthDay(birthday: string) {
  return birthday.replace('-', '')
}
