/* eslint-disable no-console */
import { startApolloServer } from './apollo/server'
import { pool } from './database/postgres'
import { redisClient } from './database/redis'
import { pgUri, redisConnectionString } from './utils/constants'

pool
  .query('SELECT CURRENT_TIMESTAMP')
  .then(({ rows }) =>
    console.log(
      `🚅 Connected to ${pgUri} at ${new Date(rows[0].current_timestamp).toLocaleString()}`
    )
  )
  .catch((error) => {
    throw new Error('Cannot connect to PostgreSQL server... ' + error)
  })

redisClient
  .time()
  .then((value) =>
    console.log(
      `📮 Connected to ${redisConnectionString} at ${new Date(value[0] * 1000).toLocaleString()}`
    )
  )
  .catch((error) => {
    throw new Error('Cannot connect to Redis server... ' + error)
  })

startApolloServer()
  .then((url) => console.log(`🚀 Server ready at ${url}`))
  .catch((error) => {
    throw new Error('Cannot start Apollo server... ' + error)
  })
