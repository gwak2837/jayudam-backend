import { networkInterfaces } from 'os'

/* eslint-disable no-console */
import { startApolloServer } from './apollo/server'
import { pool } from './database/postgres'
import { redisClient } from './database/redis'
import { NODE_ENV, PGURI, PORT, REDIS_CONNECTION_STRING } from './utils/constants'

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

startApolloServer()
  .then((url) => {
    console.log(`🚀 Server ready at: ${url}`)
    if (NODE_ENV !== 'production' && nets.en0)
      console.log(`🚀 On Your Network: http://${nets.en0[1].address}:${PORT}`)
  })
  .catch((error) => {
    throw new Error('Cannot start Apollo server... ' + error)
  })
