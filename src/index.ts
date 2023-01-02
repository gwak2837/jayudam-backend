import { networkInterfaces } from 'os'

import { NODE_ENV, PGURI, PORT, REDIS_CONNECTION_STRING } from './common/constants'
import { pool } from './common/postgres'
import { redisClient } from './common/redis'
import { startFastifyServer as startServer } from './routes'

/* eslint-disable no-console */

const nets = networkInterfaces()

pool
  .query('SELECT CURRENT_TIMESTAMP')
  .then(({ rows }) =>
    console.log(
      `🚅 Connected to ${PGURI} at ${new Date(rows[0].current_timestamp).toLocaleString()}`
    )
  )
  .catch((error) => {
    throw new Error('Cannot connect to PostgreSQL server... ' + error)
  })

redisClient
  .time()
  .then((value) =>
    console.log(
      `📮 Connected to ${REDIS_CONNECTION_STRING} at ${new Date(value[0] * 1000).toLocaleString()}`
    )
  )
  .catch((error) => {
    throw new Error('Cannot connect to Redis server... ' + error)
  })

startServer()
  .then((url) => {
    console.log(`🚀 Server ready at: ${url}`)
    if (NODE_ENV !== 'production' && nets.en0)
      console.log(`🚀 On Your Network: http://${nets.en0[1].address}:${PORT}`)
  })
  .catch((error) => {
    throw new Error('Cannot start GraphQL server... ' + error)
  })
