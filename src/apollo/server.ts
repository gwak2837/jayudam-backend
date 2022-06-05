import http from 'http'

import { BaseRedisCache, RedisClient } from 'apollo-server-cache-redis'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import Redis from 'ioredis'

import { resolvers } from '../graphql'
import typeDefs from '../graphql/generated/schema.graphql'
import { redisConnectionString } from '../utils/constants'
import { verifyJWT } from '../utils/jwt'

// import { poolQuery } from '../database/postgres'

export type ApolloContext = {
  userId?: string
}

export async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express()
  app.disable('x-powered-by')
  // app.use(cors())
  // setOAuthStrategies(app)
  // setFileUploading(app)
  const httpServer = http.createServer(app)

  // Same ApolloServer initialization as before, plus the drain plugin.
  const apolloServer = new ApolloServer({
    cache: new BaseRedisCache({
      client: new Redis(redisConnectionString) as RedisClient,
    }),
    context: async ({ req }) => {
      const jwt = req.headers.authorization
      if (!jwt) return {}

      const verifiedJwt = await verifyJWT(jwt).catch(() => null)

      if (!verifiedJwt) return {}

      return { userId: verifiedJwt.userId }

      // const { rowCount, rows } = await poolQuery(user, [
      //   verifiedJwt.userId,
      //   new Date(((verifiedJwt.iat ?? 0) + 2) * 1000),
      // ])

      // // 로그아웃 등으로 인해 JWT가 유효하지 않을 때
      // if (!rowCount) return {}

      // return { userId: rows[0].id }
    },
    csrfPrevention: true,
    introspection: process.env.ENV?.startsWith('local'),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    resolvers,
    typeDefs,
  })

  // More required logic for integrating with Express
  await apolloServer.start()
  apolloServer.applyMiddleware({
    app,
    path: '/',
  })

  return new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT ?? 4000 }, () =>
      resolve(`http://localhost:4000${apolloServer.graphqlPath}`)
    )
  )
}
