import { type Express } from 'express'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import {
  bBatonClientId,
  bBatonClientSecretKey,
  bBatonRedirectUri,
  frontendUrl,
} from '../../utils/constants'
import { generateJWT } from '../../utils/jwt'
import { IGetBBatonUserResult } from './sql/getBBatonUser'
import getBBatonUser from './sql/getBBatonUser.sql'
import { IRegisterBBatonUserResult } from './sql/registerBBatonUser'
import registerBBatonUser from './sql/registerBBatonUser.sql'

export function setBBatonOAuthStrategies(app: Express) {
  // https://bauth.bbaton.com/oauth/authorize?client_id=JDJhJDA0JHRqNmFYckhyZXBWVGlKLnFkNzUvTGV5VWYwVGdyTEdXLkpYUzFP&redirect_uri=http://localhost:4000/oauth/bbaton&response_type=code&scope=read_profile
  app.get('/oauth/bbaton', async (req, res) => {
    const code = req.query.code
    if (!code) return res.status(400).send('Bad Request')

    const bBatonUserToken = await fetchBBatonUserToken(code as string)
    if (bBatonUserToken.error) return res.status(400).send('Bad Request')

    const bBatonUserInfo = await fetchBBatonUserInfo('bBatonUserToken.access_token')
    if (bBatonUserInfo.error) return res.status(400).send('Bad Request')

    // user_id: 'gwak2837',
    // adult_flag: 'Y',
    // birth_year: '20',
    // gender: 'M',
    // income: 'N/A',
    // student: 'Y',
    // result_code: '00',
    // result_message: 'Success'

    const frontendUrl = getFrontendUrl(req.headers.referer)
  })
}

async function fetchBBatonUserToken(code: string) {
  const bBatonAuthString = `${bBatonClientId}:${bBatonClientSecretKey}`

  const response = await fetch('https://bauth.bbaton.com/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(bBatonAuthString).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      redirect_uri: bBatonRedirectUri,
      code,
    }).toString(),
  })

  return response.json() as Promise<Record<string, any>>
}

async function fetchBBatonUserInfo(accessToken: string) {
  const response = await fetch('https://bapi.bbaton.com/v2/user/me', {
    headers: {
      Authorization: `bearer ${accessToken}`,
    },
  })
  return response.json() as Promise<Record<string, any>>
}

function getFrontendUrl(referer?: string) {
  switch (referer) {
    case 'https://accounts.bBaton.com/':
    case 'https://kauth.bBaton.com/':
    case undefined:
      return frontendUrl
    default:
      return referer.substring(0, referer?.length - 1)
  }
}
