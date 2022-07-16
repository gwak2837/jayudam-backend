import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers, User } from '../generated/graphql'
import { IIsUniqueNicknameResult } from './sql/isUniqueNickname'
import isUniqueNickname from './sql/isUniqueNickname.sql'
import { IMeResult } from './sql/me'
import me from './sql/me.sql'

export const Query: QueryResolvers<ApolloContext> = {
  isUniqueNickname: async (_, { nickname }) => {
    const { rowCount } = await poolQuery<IIsUniqueNicknameResult>(isUniqueNickname, [nickname])

    return rowCount === 0
  },

  me: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IMeResult>(me, [userId])

    return {
      id: rows[0].id,
      nickname: rows[0].nickname,
    } as User
  },

  userByNickname: async (_, { nickname }) => {
    if (nickname === 'undefined' || nickname === 'null')
      throw new UserInputError('허용되지 않는 닉네임입니다')

    return {} as User
  },
}
