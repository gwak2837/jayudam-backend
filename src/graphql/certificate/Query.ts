import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import doesUserJoinGroup from './sql/doesUserJoinGroup.sql'

// import myPosts from './sql/myPosts.sql'

export const Query: QueryResolvers<ApolloContext> = {
  getCertificateJWT: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')
  },
}
