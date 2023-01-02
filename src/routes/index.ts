import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify from 'fastify'
import { NoSchemaIntrospectionCustomRule } from 'graphql'
import mercurius, { IResolvers, MercuriusContext } from 'mercurius'

import {
  LOCALHOST_HTTPS_CERT,
  LOCALHOST_HTTPS_KEY,
  NODE_ENV,
  PORT,
  PROJECT_ENV,
} from '../common/constants'
import { UnauthorizedError } from '../common/fastify'
import { verifyJWT } from '../common/jwt'
import { redisClient } from '../common/redis'
import { resolvers } from '../graphql'
import schema from '../graphql/generated/schema.graphql'
import chatMutation from './chat/mutation'
import chatQuery from './chat/query'
import { setBBatonOAuthStrategies } from './oauth/bbaton'
import { setGoogleOAuthStrategies } from './oauth/google'
import { setKakaoOAuthStrategies } from './oauth/kakao'
import { setNaverOAuthStrategies } from './oauth/naver'
import pushMutation from './push/mutation'
import pushQuery from './push/query'
import uploadFiles from './upload'

export type GraphQLContext = MercuriusContext & {
  userId?: string
}

const fastify = Fastify({
  http2: true,
  // logger: true,

  ...(PROJECT_ENV.startsWith('local') && {
    https: {
      key: `-----BEGIN PRIVATE KEY-----\n${LOCALHOST_HTTPS_KEY}\n-----END PRIVATE KEY-----`,
      cert: `-----BEGIN CERTIFICATE-----\n${LOCALHOST_HTTPS_CERT}\n-----END CERTIFICATE-----`,
    },
  }),
}).withTypeProvider<TypeBoxTypeProvider>()

export type TFastify = typeof fastify

export async function startFastifyServer() {
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
  fastify.register(rateLimit, {
    ...(NODE_ENV === 'development' && {
      allowList: ['127.0.0.1'],
    }),
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
      jwt?: string
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
  await fastify.register(swagger, {
    mode: 'dynamic',
    openapi: {
      info: {
        title: 'Swagger',
        description: 'testing the fastify swagger api',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'https://localhost:4000',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header',
          },
        },
      },
      // externalDocs: Object,
      // security: [Object],
      // tags: [Object],
    },
  })

  await fastify.register(swaggerUI, {
    routePrefix: '/documentation',
    initOAuth: {},
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    // uiHooks: {
    //   onRequest: function (request, reply, next) {
    //     next()
    //   },
    //   preHandler: function (request, reply, next) {
    //     next()
    //   },
    // },
    staticCSP: true,
    // transformStaticCSP: (header) => header,
  })

  // Routes
  setBBatonOAuthStrategies(fastify)
  setGoogleOAuthStrategies(fastify)
  setKakaoOAuthStrategies(fastify)
  setNaverOAuthStrategies(fastify)

  uploadFiles(fastify)
  chatMutation(fastify)
  chatQuery(fastify)
  pushQuery(fastify)
  pushMutation(fastify)

  return fastify.listen({ host: process.env.K_SERVICE ? '0.0.0.0' : 'localhost', port: +PORT })
}
