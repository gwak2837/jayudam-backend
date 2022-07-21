import { Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { BBATON_CLIENT_ID, BBATON_CLIENT_SECRET_KEY, FRONTEND_URL } from '../../utils/constants'
import { signJWT } from '../../utils/jwt'
import { IAwakeBBatonUserResult } from './sql/awakeBBatonUser'
import awakeBBatonUser from './sql/awakeBBatonUser.sql'
import { IGetBBatonUserResult } from './sql/getBBatonUser'
import getBBatonUser from './sql/getBBatonUser.sql'
import { IRegisterBBatonUserResult } from './sql/registerBBatonUser'
import registerBBatonUser from './sql/registerBBatonUser.sql'
import { BBatonUser, BBatonUserToken, encodeSex, getFrontendUrl } from '.'

export function setBBatonOAuthStrategies(app: Express) {
  // BBaton 계정으로 가입하기
  app.get('/oauth/bbaton', async (req, res) => {
    // 입력값 검사
    const code = req.query.code as string
    const backendUrl = req.headers.host as string
    const registerConfig = getRegisterConfig(req.query.state as string)
    if (!code || !backendUrl) return res.status(400).send('Bad Request')

    // OAuth 사용자 정보 가져오기
    // const bBatonUserToken = await fetchBBatonUserToken(code, `${req.protocol}://${backendUrl}`)
    const bBatonUserToken = await fetchBBatonUserToken(
      code,
      backendUrl === 'localhost:4000' ? 'http://localhost:4000' : `https://${backendUrl}`
    )
    if (bBatonUserToken.error) return res.status(400).send('Bad Request2')

    const bBatonUser = await fetchBBatonUser(bBatonUserToken.access_token)
    if (bBatonUser.error) return res.status(400).send('Bad Request3')

    const frontendUrl = getFrontendUrl(req.headers.referer)

    if (bBatonUser.adult_flag !== 'Y') return res.redirect(`${frontendUrl}/oauth?isAdult=false`)

    // 자유담 사용자 정보 가져오기
    const { rowCount, rows: rows2 } = await poolQuery<IGetBBatonUserResult>(getBBatonUser, [
      bBatonUser.user_id,
    ])
    const jayudamUser = rows2[0]

    // 처음 가입하는 경우
    if (rowCount === 0) {
      const { rows } = await poolQuery<IRegisterBBatonUserResult>(registerBBatonUser, [
        bBatonUser.user_id,
        registerConfig?.personalDataStoringPeriod ?? 1,
        encodeSex(bBatonUser.gender),
      ])

      const querystring = new URLSearchParams({
        jwt: await signJWT({ userId: rows[0].id }),
      })
      return res.redirect(`${frontendUrl}/oauth?${querystring}`)
    }

    // 정지된 계정인 경우
    if (jayudamUser.blocking_start_time)
      return res.redirect(
        `${frontendUrl}/oauth?isBlocked=true&from=${jayudamUser.blocking_start_time}&to=${jayudamUser.blocking_end_time}`
      )

    // 휴먼 계정인 경우
    if (jayudamUser.sleeping_time) {
      // WIP: 개인정보보호법에 따라 컨테이너로 분리된 DB에서 데이터 가져오는 로직 필요
      await poolQuery<IAwakeBBatonUserResult>(awakeBBatonUser, [
        jayudamUser.id,
        encodeSex(bBatonUser.gender),
      ])

      const nickname = jayudamUser.nickname ?? ''
      const querystring = new URLSearchParams({
        jwt: await signJWT({ userId: jayudamUser.id }),
        nickname,
      })
      return res.redirect(`${frontendUrl}/oauth?${querystring}`)
    }

    // 이미 가입된 경우
    const nickname = jayudamUser.nickname ?? ''
    const querystring = new URLSearchParams({
      jwt: await signJWT({ userId: jayudamUser.id }),
      nickname,
    })
    return res.redirect(`${frontendUrl}/oauth?${querystring}`)
  })
}

function getRegisterConfig(string: string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    return null
  }
}

async function fetchBBatonUserToken(code: string, backendUrl: string) {
  const bBatonAuthString = `${BBATON_CLIENT_ID}:${BBATON_CLIENT_SECRET_KEY}`

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
