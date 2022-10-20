import fetch from 'node-fetch'

import { BBATON_CLIENT_ID, BBATON_CLIENT_SECRET_KEY } from '../../common/constants'
import { signJWT } from '../../common/jwt'
import { poolQuery } from '../../common/postgres'
import awakeBBatonUser from './sql/awakeBBatonUser.sql'
import type { IGetBBatonUserResult } from './sql/getBBatonUser'
import getBBatonUser from './sql/getBBatonUser.sql'
import type { IRegisterBBatonUserResult } from './sql/registerBBatonUser'
import registerBBatonUser from './sql/registerBBatonUser.sql'
import updateBBatonUser from './sql/updateBBatonUser.sql'
import { BBatonUser, BBatonUserToken, encodeSex, getFrontendUrl, querystringCode } from '.'
import { TFastify } from '..'

export function setBBatonOAuthStrategies(fastify: TFastify) {
  // BBaton 계정으로 가입하기
  fastify.get('/oauth/bbaton', querystringCode, async (request, reply) => {
    const code = request.query.code
    const backendUrl = request.headers[':authority']
    if (!backendUrl) return reply.status(400).send('Bad Request')

    // OAuth 사용자 정보 가져오기
    const bBatonUserToken = await fetchBBatonUserToken(code, `https://${backendUrl}`)
    if (bBatonUserToken.error) return reply.status(400).send('Bad Request2')

    const bBatonUser = await fetchBBatonUser(bBatonUserToken.access_token)
    if (bBatonUser.error) return reply.status(400).send('Bad Request3')

    const frontendUrl = getFrontendUrl(request.headers.referer)
    const encodedBBatonUserSex = encodeSex(bBatonUser.gender)
    if (bBatonUser.adult_flag !== 'Y') return reply.redirect(`${frontendUrl}/oauth?isAdult=false`)

    // 자유담 사용자 정보 가져오기
    const { rowCount, rows: rows2 } = await poolQuery<IGetBBatonUserResult>(getBBatonUser, [
      bBatonUser.user_id,
    ])
    const jayudamUser = rows2[0]

    // 처음 가입하는 경우
    if (rowCount === 0) {
      const { rows } = await poolQuery<IRegisterBBatonUserResult>(registerBBatonUser, [
        bBatonUser.user_id,
        encodedBBatonUserSex,
      ])

      const querystring = new URLSearchParams({
        jwt: await signJWT({ userId: rows[0].id }),
      })
      return reply.redirect(`${frontendUrl}/oauth?${querystring}`)
    }

    // BBaton 사용자 정보가 달라진 경우
    if (jayudamUser.sex !== encodedBBatonUserSex) {
      await poolQuery(updateBBatonUser, [jayudamUser.id, encodedBBatonUserSex])
    }

    // 정지된 계정인 경우
    if (jayudamUser.blocking_start_time)
      return reply.redirect(
        `${frontendUrl}/oauth?isBlocked=true&from=${jayudamUser.blocking_start_time}&to=${jayudamUser.blocking_end_time}`
      )

    // 휴먼 계정인 경우
    if (jayudamUser.sleeping_time) {
      // WIP: 개인정보보호법에 따라 컨테이너로 분리된 DB에서 데이터 가져오는 로직 필요
      await poolQuery(awakeBBatonUser, [jayudamUser.id, encodedBBatonUserSex])
    }

    // 이미 가입된 경우
    const querystring = new URLSearchParams({
      jwt: await signJWT({ userId: jayudamUser.id }),
      ...(jayudamUser.name && { username: jayudamUser.name }),
    })
    return reply.redirect(`${frontendUrl}/oauth?${querystring}`)
  })
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
