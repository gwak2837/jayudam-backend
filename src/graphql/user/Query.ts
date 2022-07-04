import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers, User } from '../generated/graphql'
import { IMeResult } from './sql/me'
import me from './sql/me.sql'

export const Query: QueryResolvers<ApolloContext> = {
  me: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const { rows } = await poolQuery<IMeResult>(me, [userId])

    return {
      id: rows[0].id,
      nickname: rows[0].nickname,
    } as User
  },
}
