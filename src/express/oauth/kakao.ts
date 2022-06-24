import { Express } from 'express'
import LunarJS from 'lunar-javascript'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { redisClient } from '../../database/redis'
import {
  frontendUrl,
  kakaoAdminKey,
  kakaoClientSecret,
  kakaoRestApiKey,
} from '../../utils/constants'
import { generateJWT, verifyJWT } from '../../utils/jwt'
import { IGetKakaoUserResult } from './sql/getKakaoUser'
import getKakaoUser from './sql/getKakaoUser.sql'
import { IGetUserResult } from './sql/getUser'
import getUser from './sql/getUser.sql'
import { IUpdateKakaoUserResult } from './sql/updateKakaoUser'
import updateKakaoUser from './sql/updateKakaoUser.sql'
import { encodeSex, isValidFrontendUrl } from '.'

const Lunar = LunarJS.Lunar

export function setKakaoOAuthStrategies(app: Express) {
  // https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=fa17772ea56b216e0fd949141f5ed5e2&redirect_uri=http://localhost:4000/oauth/kakao&state=jwt
  // Kakao 계정으로 로그인하기
  app.get('/oauth/kakao', async (req, res) => {
    // request 검사
    const code = req.query.code as string
    const referer = req.headers.referer as string
    if (!code || !isValidFrontendUrl(referer)) return res.status(400).send('Bad Request')

    // OAuth 사용자 정보 가져오기
    const kakaoUserToken = await fetchKakaoUserToken(code as string)
    if (kakaoUserToken.error) return res.status(400).send('Bad Request')

    const kakaoUser = await fetchKakaoUser(kakaoUserToken.access_token)
    if (!kakaoUser.id) return res.status(400).send('Bad Request')

    const kakaoAccount = kakaoUser.kakao_account
    const frontendUrl = getFrontendUrl(referer)

    // 자유담 사용자 정보 가져오기
    const { rows } = await poolQuery<IGetKakaoUserResult>(getKakaoUser, [kakaoUser.id])
    const jayudamUser = rows[0]

    // OAuth 사용자 정보와 자유담 사용자 정보 비교
    if (
      jayudamUser.sex !== encodeSex(kakaoAccount.gender) ||
      (jayudamUser.name && jayudamUser.name !== kakaoAccount.name) ||
      (jayudamUser.birthyear && jayudamUser.birthyear !== kakaoAccount.birthyear) ||
      (jayudamUser.birthday && jayudamUser.birthday !== kakaoAccount.birthday) ||
      (jayudamUser.phone_number && jayudamUser.phone_number !== kakaoAccount.phone_number)
    )
      return res.redirect(`${frontendUrl}/oauth?jayudamUserMatchWithOAuthUser=false&oauth=kakao`)

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
    return res.redirect(`${frontendUrl}/oauth?isAlreadyAssociatedWithOAuth=false&oauth=kakao`)
  })

  // https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=fa17772ea56b216e0fd949141f5ed5e2&redirect_uri=http://localhost:4000/oauth/kakao/register
  // Kakao 계정 연결하기
  // 필수 수집: 카카오 식별 번호, 성별, 출생년도, 출생월일, 이름, 전화번호
  // 선택 수집: 닉네임, 프로필 사진, 이메일
  app.get('/oauth/kakao/register', async (req, res) => {
    // request 검사
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
    const [{ rowCount, rows: userResult }, kakaoUser2] = await Promise.all([
      poolQuery<IGetUserResult>(getUser, [verifiedJwt.userId]),
      fetchFromKakao(code),
    ])
    if (rowCount === 0 || !kakaoUser2.id) return res.status(400).send('Bad Request') // user가 존재하지 않으면 JWT secret key가 유출됐다는 뜻

    const jayudamUser = userResult[0]
    const kakaoUser = kakaoUser2.kakao_account
    const kakaoUserBirthday = getKakaoSolarBirthday(kakaoUser)

    // 이미 OAuth 연결되어 있으면
    if (jayudamUser.kakao_oauth)
      return res.redirect(`${frontendUrl}/oauth?isAlreadyAssociatedWithOAuth=true&oauth=kakao`)

    // OAuth 사용자 정보와 자유담 사용자 정보 비교
    if (
      jayudamUser.sex !== encodeSex(kakaoUser.gender) ||
      (jayudamUser.name && jayudamUser.name !== kakaoUser.name) ||
      (jayudamUser.birthyear && jayudamUser.birthyear !== kakaoUser.birthyear) ||
      (jayudamUser.birthday && jayudamUser.birthday !== kakaoUserBirthday) ||
      (jayudamUser.phone_number && jayudamUser.phone_number !== kakaoUser.phone_number)
    )
      return res.redirect(`${frontendUrl}/oauth?jayudamUserMatchWithOAuthUser=false&oauth=kakao`)

    await poolQuery<IUpdateKakaoUserResult>(updateKakaoUser, [
      jayudamUser.id,
      kakaoUser.email,
      kakaoUser.profile.is_default_image ? null : kakaoUser.profile.profile_image_url,
      kakaoUser2.id,
    ])

    return res.redirect(
      `${frontendUrl}/oauth?${new URLSearchParams({
        jwt: await generateJWT({ userId: jayudamUser.id }),
        ...(jayudamUser.nickname && { nickname: jayudamUser.nickname }),
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

async function fetchFromKakao(code: string) {
  const kakaoUserToken = await fetchKakaoUserToken(code)
  if (kakaoUserToken.error) return { error: true }

  const kakaoUser = await fetchKakaoUser(kakaoUserToken.access_token)
  if (kakaoUser.error) return { error: true }

  return kakaoUser
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

async function fetchKakaoUser(accessToken: string) {
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

function getKakaoSolarBirthday(kakaoUser: any) {
  if (kakaoUser.birthday_type === 'SOLAR') return kakaoUser.birthday

  const solarFromLunar = Lunar.fromYmd(
    kakaoUser.birthyear,
    +kakaoUser.birthday.slice(0, 2),
    +kakaoUser.birthday.slice(2)
  ).getSolar()
  return `${solarFromLunar.getMonth().padStart(2, '0')}${solarFromLunar.getDay().padStart(2, '0')}`
}
