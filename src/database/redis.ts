import Redis from 'ioredis'

import {
  projectEnv,
  redisCA,
  redisClientCert,
  redisClientKey,
  redisConnectionString,
} from '../utils/constants'

export const redisClient = new Redis(redisConnectionString, {
  ...((projectEnv === 'cloud-dev' ||
    projectEnv === 'cloud-production' ||
    projectEnv === 'local-production') && {
    tls: {
      ca: `-----BEGIN CERTIFICATE-----\n${redisCA}\n-----END CERTIFICATE-----`,
      key: `-----BEGIN PRIVATE KEY-----\n${redisClientKey}\n-----END PRIVATE KEY-----`,
      cert: `-----BEGIN CERTIFICATE-----\n${redisClientCert}\n-----END CERTIFICATE-----`,
      checkServerIdentity: () => {
        return undefined
      },
    },
  }),
})
