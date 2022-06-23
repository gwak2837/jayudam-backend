import { Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { redisClient } from '../../database/redis'
import { frontendUrl, googleClientId, googleClientSecretKey } from '../../utils/constants'
import { generateJWT, verifyJWT } from '../../utils/jwt'
import { IGetGoogleUserResult } from './sql/getGoogleUser'
import getGoogleUser from './sql/getGoogleUser.sql'
import { IGetUserResult } from './sql/getUser'
import getUser from './sql/getUser.sql'
import { IRegisterGoogleUserResult } from './sql/registerGoogleUser'
import registerGoogleUser from './sql/registerGoogleUser.sql'
import { isValidFrontendUrl } from '.'

export function setGoogleOAuthStrategies(app: Express) {
  // https://accounts.google.com/o/oauth2/v2/auth?client_id=289678734309-fd454q2i8b65ud4fjsm6tq7r7vab3d1v.apps.googleusercontent.com&redirect_uri=http://localhost:4000/oauth/google&response_type=code&scope=openid
  // Google 계정으로 로그인하기
  app.get('/oauth/google', async (req, res) => {
    const code = req.query.code as string
    const backendUrl = req.headers.host as string
    if (!code || !backendUrl) return res.status(400).send('Bad Request')

    const googleUserToken = await fetchGoogleUserToken(code, `${req.protocol}://${backendUrl}`)
    if (googleUserToken.error) return res.status(400).send('Bad Request')

    const googleUserInfo = await fetchGoogleUserInfo(googleUserToken.access_token)
    if (googleUserInfo.error) return res.status(400).send('Bad Request')

    const referer = req.headers.referer as string
    if (!isValidFrontendUrl(referer)) return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(referer)

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
    return res.status(401).send('The account associated with the Google account does not exist.')
  })

  // https://accounts.google.com/o/oauth2/v2/auth?client_id=289678734309-fd454q2i8b65ud4fjsm6tq7r7vab3d1v.apps.googleusercontent.com&redirect_uri=http://localhost:4000/oauth/google/register&response_type=code&scope=email+profile+openid&state=jwt
  // Google 계정 연결하기
  // 필수 수집: Google 식별 번호
  // 선택 수집: 이메일, 이름, 프로필 사진
  app.get('/oauth/google/register', async (req, res) => {
    const code = req.query.code as string
    const backendUrl = req.headers.host as string
    if (!code || !backendUrl) return res.status(400).send('Bad Request')

    const jwt = req.query.state as string
    if (!jwt) return res.status(400).send('Bad Request')

    const verifiedJwt = await verifyJWT(jwt)
    if (!verifiedJwt.iat) return res.status(401).send('Not Unauthorized')

    const referer = req.headers.referer as string
    if (!isValidFrontendUrl(referer)) return res.status(400).send('Bad Request')

    const frontendUrl = getFrontendUrl(referer)

    const logoutTime = await redisClient.get(`${verifiedJwt.userId}:logoutTime`)
    if (Number(logoutTime) > Number(verifiedJwt.iat))
      return res.redirect(`${frontendUrl}/oauth?removeJWT=true`)

    const [{ rowCount, rows: userResult }, googleUser] = await Promise.all([
      poolQuery<IGetUserResult>(getUser, [verifiedJwt.userId]),
      fetchGoogleUser(code, backendUrl),
    ])
    if (rowCount === 0 || googleUser.error) return res.status(400).send('Bad Request') // user가 존재하지 않으면 JWT secret key가 유출됐다는 뜻

    const user = userResult[0]

    // 기존 정보랑 비교하기
    if (user.name !== googleUser.name)
      return res.status(403).send("User real name doesn't not match with name in google account")

    // 정보 업데이트 하기
    // const { rows } = await poolQuery<IRegisterKakaoUserResult>(registerKakaoUser, [
    //   kakaoAccount.email,
    //   kakaoAccount.profile.nickname,
    //   kakaoAccount.phone_number,
    //   kakaoAccount.birthyear,
    //   kakaoAccount.birthday,
    //   encodeSex(kakaoAccount.gender),
    //   '소개가 아직 없어요.',
    //   kakaoAccount.profile.profile_image_url,
    //   kakaoUserInfo.id,
    // ])
    // return res.redirect(
    //   `${frontendUrl}/oauth?${new URLSearchParams({
    //     jwt: await generateJWT({ userId: rows[0].id }),
    //     nickname: kakaoAccount.profile.nickname,
    //   })}`
    // )
  })
}

async function fetchGoogleUser(code: string, backendUrl: string) {
  const googleUserToken = await fetchGoogleUserToken(code, backendUrl)
  if (googleUserToken.error) return { error: true }

  const googleUserInfo = await fetchGoogleUserInfo(googleUserToken.access_token)
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
