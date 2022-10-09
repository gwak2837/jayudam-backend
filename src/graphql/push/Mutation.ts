import { redisClient } from '../../database/redis'
import { ServiceUnavailableError, UnauthorizedError } from '../../fastify/errors'
import { GraphQLContext } from '../../fastify/server'
import { MutationResolvers } from '../generated/graphql'

export const Mutation: MutationResolvers<GraphQLContext> = {
  createPushSubscription: async (_, { input }, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const logoutTime = await redisClient.set(`${userId}:pushSubscription`, JSON.stringify(input))
    if (logoutTime !== 'OK') throw ServiceUnavailableError('Redis unavailable error')

    return true
  },

  deletePushSubscription: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const removedCount = await redisClient.del(`${userId}:pushSubscription`)
    if (removedCount !== 1) throw ServiceUnavailableError('Redis unavailable error')

    return true
  },
}
