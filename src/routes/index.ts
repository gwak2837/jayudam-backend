import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// eslint-disable-next-line import/default
import autoLoad from '@fastify/autoload'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import Fastify, { FastifyInstance } from 'fastify'
import { NoSchemaIntrospectionCustomRule } from 'graphql'
import mercurius, { IResolvers, MercuriusContext } from 'mercurius'

import {
  LOCALHOST_HTTPS_CERT,
  LOCALHOST_HTTPS_KEY,
  NODE_ENV,
  PORT,
  PROJECT_ENV,
} from '../common/constants'
import { verifyJWT } from '../common/jwt'
import { redisClient } from '../common/redis'
import { UnauthorizedError } from '../fastify/errors'
import { resolvers } from '../graphql'
import schema from '../graphql/generated/schema.graphql'
import setChatMutation from './chat/mutation'
import setChatQuery from './chat/query'
import { setOAuthStrategies } from './oauth'
import { setUploadingFiles } from './upload'

export type GraphQLContext = MercuriusContext & {
  userId?: string
}

export type FastifyHttp2 = FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse>

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

export async function startFastifyServer() {
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

  // CORS
  fastify.register(cors, {
    origin: [
      'http://localhost:3000',
      'https://jayudam.app',
      'https://jayudam.vercel.app',
      'https://jayudam-git-dev-gwak2837.vercel.app',
      /^https:\/\/jayudam-[a-z0-9]{1,20}-gwak2837\.vercel\.app/,
    ],
  })

  // Prevent DoS
  fastify.register(import('@fastify/rate-limit'), {
    allowList: ['127.0.0.1'],
  })

  // GraphQL API
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

  // REST API Authentication
  fastify.decorateRequest('userId', null)

  type QuerystringJWT = {
    Querystring: {
      jwt: string
    }
  }

  fastify.addHook<QuerystringJWT>('onRequest', async (req) => {
    const jwt = req.headers.authorization ?? req.query.jwt
    if (!jwt) return

    const verifiedJwt = await verifyJWT(jwt)
    if (!verifiedJwt.iat) throw UnauthorizedError('다시 로그인 해주세요')

    const logoutTime = await redisClient.get(`${verifiedJwt.userId}:logoutTime`)
    if (Number(logoutTime) > Number(verifiedJwt.iat) * 1000)
      throw UnauthorizedError('다시 로그인 해주세요')

    req.userId = verifiedJwt.userId
  })

  // Swagger
  // await fastify.register(swagger, {
  //   openapi: {
  //     info: {
  //       title: 'Test swagger',
  //       description: 'testing the fastify swagger api',
  //       version: '0.1.0',
  //     },
  //     servers: [
  //       {
  //         url: 'httpㄴ://localhost:4000',
  //       },
  //     ],
  //     components: {
  //       securitySchemes: {
  //         apiKey: {
  //           type: 'apiKey',
  //           name: 'apiKey',
  //           in: 'header',
  //         },
  //       },
  //     },
  //   },
  //   hideUntagged: true,
  //   exposeRoute: true,
  // })

  fastify.register(autoLoad, {
    dir: join(__dirname, './'),
  })

  setOAuthStrategies(fastify)
  setUploadingFiles(fastify)
  setChatMutation(fastify)
  setChatQuery(fastify)

  return fastify.listen({ host: process.env.K_SERVICE ? '0.0.0.0' : 'localhost', port: +PORT })
}
