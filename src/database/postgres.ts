import pg from 'pg'

import { DatabaseQueryError } from '../apollo/errors'
import { formatDate } from '../utils'
import { certificateAuthority, pgUri, projectEnv } from '../utils/constants'

const { Pool } = pg

// https://github.com/brianc/node-postgres/issues/2089
export const pool = new Pool({
  connectionString: pgUri,

  ...((projectEnv === 'cloud-dev' ||
    projectEnv === 'cloud-production' ||
    projectEnv === 'local-production') && {
    ssl: {
      rejectUnauthorized: true,
      ca: `-----BEGIN CERTIFICATE-----\n${certificateAuthority}\n-----END CERTIFICATE-----`,
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
      console.error(error.message, sql, values)
      throw new DatabaseQueryError('Database query error')
    } else {
      throw new DatabaseQueryError(error)
    }
  })
}
