import http from 'http'

import { BaseRedisCache, RedisClient } from 'apollo-server-cache-redis'
import { ApolloServerPluginDrainHttpServer, AuthenticationError } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { redisClient } from '../database/redis'
import { setOAuthStrategies } from '../express/oauth'
import { setUploadingFiles } from '../express/upload'
import { resolvers } from '../graphql'
import typeDefs from '../graphql/generated/schema.graphql'
import { PORT, PROJECT_ENV } from '../utils/constants'
import { verifyJWT } from '../utils/jwt'

export type ApolloContext = {
  userId?: string
}

// https://www.apollographql.com/docs/apollo-server/integrations/middleware#example
export async function startApolloServer() {
  const app = express()
  app.disable('x-powered-by')
  // app.use(cors())
  app.use(express.json())

  setOAuthStrategies(app)
  setUploadingFiles(app)

  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    cache: new BaseRedisCache({
      client: redisClient as RedisClient,
    }),
    context: async ({ req }) => {
      const jwt = req.headers.authorization
      if (!jwt) return {}

      const verifiedJwt = await verifyJWT(jwt)
      if (!verifiedJwt.iat) throw new AuthenticationError('다시 로그인 해주세요')

      const logoutTime = await redisClient.get(`${verifiedJwt.userId}:logoutTime`)
      if (Number(logoutTime) > Number(verifiedJwt.iat) * 1000)
        throw new AuthenticationError('다시 로그인 해주세요')

      return { userId: verifiedJwt.userId }
    },
    introspection: PROJECT_ENV.startsWith('local'),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    resolvers,
    typeDefs,
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({
    app,
    path: '/',
  })

  return new Promise((resolve) =>
    httpServer.listen({ port: PORT }, () =>
      resolve(`http://localhost:${PORT}${apolloServer.graphqlPath}`)
    )
  )
}
