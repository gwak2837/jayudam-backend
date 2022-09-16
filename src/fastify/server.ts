import cors from '@fastify/cors'
import Fastify, { FastifyInstance } from 'fastify'
import { NoSchemaIntrospectionCustomRule } from 'graphql'
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2'
import mercurius, { IResolvers, MercuriusContext } from 'mercurius'

import { redisClient } from '../database/redis'
import { setOAuthStrategies } from './oauth'
import { resolvers } from '../graphql'
import schema from '../graphql/generated/schema.graphql'
import {
  LOCALHOST_HTTPS_CERT,
  LOCALHOST_HTTPS_KEY,
  NODE_ENV,
  PORT,
  PROJECT_ENV,
} from '../utils/constants'
import { verifyJWT } from '../utils/jwt'
import { UnauthorizedError } from './errors'
import { setUploadingFiles } from './upload'

export type GraphQLContext = MercuriusContext & {
  userId?: string
}

export type FastifyHttp2 = FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse>

export async function startGraphQLServer() {
  const fastify: FastifyHttp2 = Fastify({
    http2: true,
    // logger: true,

    ...(PROJECT_ENV.startsWith('local') && {
      https: {
        key: `-----BEGIN PRIVATE KEY-----\n${LOCALHOST_HTTPS_KEY}\n-----END PRIVATE KEY-----`,
        cert: `-----BEGIN CERTIFICATE-----\n${LOCALHOST_HTTPS_CERT}\n-----END CERTIFICATE-----`,
      },
    }),
  })

  fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      'https://jayudam.app',
      'https://jayudam.vercel.app',
      'https://jayudam-git-dev-gwak2837.vercel.app',
      /^https:\/\/jayudam-[a-z0-9]{1,20}-gwak2837\.vercel\.app/,
    ],
  })

  fastify.register(import('@fastify/rate-limit'), {
    allowList: ['127.0.0.1'],
  })

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

  setOAuthStrategies(fastify)
  setUploadingFiles(fastify)

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

  return fastify.listen({ host: process.env.K_SERVICE ? '0.0.0.0' : 'localhost', port: +PORT })
}
