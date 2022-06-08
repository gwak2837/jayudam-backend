import Redis from 'ioredis'

import { redisConnectionString } from '../utils/constants'

export const redisClient = new Redis(redisConnectionString)
