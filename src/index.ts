/* eslint-disable no-console */
import { startApolloServer } from './apollo/server'
import { pool } from './database/postgres'
import { pgUri } from './utils/constants'

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

startApolloServer()
  .then((url) => console.log(`🚀 Server ready at ${url}`))
  .catch((error) => {
    throw new Error('Cannot start Apollo server... ' + error)
  })
