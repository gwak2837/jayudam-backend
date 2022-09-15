import cors from '@fastify/cors'
import Fastify, { FastifyInstance } from 'fastify'
import { NoSchemaIntrospectionCustomRule } from 'graphql'
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2'
import mercurius, { IResolvers, MercuriusContext } from 'mercurius'

import { redisClient } from '../database/redis'
import { setOAuthStrategies, vercelURLRegEx } from '../express/oauth'
import { resolvers } from '../graphql'
import schema from '../graphql/generated/schema.graphql'
import { LOCALHOST_HTTPS_CERT, LOCALHOST_HTTPS_KEY, NODE_ENV, PORT } from '../utils/constants'
import { verifyJWT } from '../utils/jwt'
import { UnauthorizedError } from './errors'

export type GraphQLContext = MercuriusContext & {
  userId?: string
}

export type FastifyHttp2 = FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse>

export async function startGraphQLServer() {
  const fastify: FastifyHttp2 = Fastify({
    http2: true,
    // logger: true,

    ...(NODE_ENV && {
      https: { key: LOCALHOST_HTTPS_KEY, cert: LOCALHOST_HTTPS_CERT },
    }),
  })

  fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      vercelURLRegEx,
      'https://jayudam.app/',
      'https://jayudam.vercel.app/',
    ],
  })

  setOAuthStrategies(fastify)
  // setUploadingFiles(app)

  fastify.register(mercurius, {
    // cache: new BaseRedisCache({
    //   client: redisClient as RedisClient,
    // }),
    context: async (req) => {
      const jwt = req.headers.authorization
      if (!jwt) return {}

      const verifiedJwt = await verifyJWT(jwt)
      if (!verifiedJwt.iat) throw UnauthorizedError('다시 로그인 해주세요')

      const logoutTime = await redisClient.get(`${verifiedJwt.userId}:logoutTime`)
      if (Number(logoutTime) > Number(verifiedJwt.iat) * 1000)
        throw UnauthorizedError('다시 로그인 해주세요')

      return { userId: verifiedJwt.userId }
    },
    path: '/',
    persistedQueryProvider: mercurius.persistedQueryDefaults.automatic(5000),
    resolvers: resolvers as IResolvers,
    schema,
    validationRules: NODE_ENV === 'production' ? [NoSchemaIntrospectionCustomRule] : undefined,
  })

  // //////////////////////////////////////////////
  const opts = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          code: { type: 'string' },
        },
        required: ['code'],
      },
    },
  }

  fastify.get('/hello', opts, async (request) => {
    return { hello: request.query }
  })
  // //////////////////////////////////////////////

  return fastify.listen({ port: +PORT })
}
