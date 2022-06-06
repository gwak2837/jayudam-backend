import { Result } from 'ioredis'
import pg from 'pg'

import { DatabaseQueryError } from '../apollo/errors'
import { formatDate } from '../utils'
import { pgUri, projectEnv } from '../utils/constants'

const { Pool } = pg

export const pool = new Pool({
  connectionString: pgUri,

  ...(projectEnv === 'cloud-dev' && {
    ssl: {
      rejectUnauthorized: true,
      ca: `-----BEGIN CERTIFICATE-----\n${process.env.CA_CERTIFICATE}\n-----END CERTIFICATE-----`,
      checkServerIdentity: () => {
        return undefined
      },
    },
  }),
})

export async function poolQuery<Results>(sql: string, values?: unknown[]) {
  if (projectEnv.startsWith('local')) {
    // eslint-disable-next-line no-console
    console.log(formatDate(new Date()), '-', sql, values)
  }

  return pool.query<Results>(sql, values).catch((error) => {
    if (process.env.NODE_ENV === 'production') {
      console.error(error.message)
      console.error(sql, values)
      throw new DatabaseQueryError('Database query error')
    } else {
      throw new DatabaseQueryError(error)
    }
  })
}
