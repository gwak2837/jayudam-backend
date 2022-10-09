import Redis from 'ioredis'

import {
  PROJECT_ENV,
  REDIS_CA,
  REDIS_CLIENT_CERT,
  REDIS_CLIENT_KEY,
  REDIS_CONNECTION_STRING,
} from '../utils/constants'

export const redisClient = new Redis(REDIS_CONNECTION_STRING, {
  retryStrategy: (times) => Math.min(times * 1000, 15_000),

  ...((PROJECT_ENV === 'cloud-dev' ||
    PROJECT_ENV === 'cloud-prod' ||
    PROJECT_ENV === 'local-prod') && {
    tls: {
      ca: `-----BEGIN CERTIFICATE-----\n${REDIS_CA}\n-----END CERTIFICATE-----`,
      key: `-----BEGIN PRIVATE KEY-----\n${REDIS_CLIENT_KEY}\n-----END PRIVATE KEY-----`,
      cert: `-----BEGIN CERTIFICATE-----\n${REDIS_CLIENT_CERT}\n-----END CERTIFICATE-----`,
      checkServerIdentity: () => {
        return undefined
      },
    },
  }),
})
