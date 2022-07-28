import pg from 'pg'

import { DatabaseQueryError } from '../apollo/errors'
import { formatDate } from '../utils'
import { NODE_ENV, PGURI, POSTGRES_CA, PROJECT_ENV } from '../utils/constants'

const { Pool } = pg

// https://github.com/brianc/node-postgres/issues/2089
export const pool = new Pool({
  connectionString: PGURI,

  ...((PROJECT_ENV === 'cloud-dev' ||
    PROJECT_ENV === 'cloud-production' ||
    PROJECT_ENV === 'local-production') && {
    ssl: {
      ca: `-----BEGIN CERTIFICATE-----\n${POSTGRES_CA}\n-----END CERTIFICATE-----`,
      checkServerIdentity: () => {
        return undefined
      },
    },
  }),
})

export async function poolQuery<Results>(sql: string, values?: unknown[]) {
  if (PROJECT_ENV.startsWith('local')) {
    // eslint-disable-next-line no-console
    console.log(formatDate(new Date()), '-', sql, values)
  }

  return pool.query<Results>(sql, values).catch((error) => {
    if (NODE_ENV === 'production') {
      console.error(error.message, sql, values)
      throw new DatabaseQueryError('Database query error')
    } else {
      throw new DatabaseQueryError(error)
    }
  })
}
