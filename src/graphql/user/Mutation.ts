import { AuthenticationError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { unregisterKakaoUser } from '../../express/oauth/kakao'
import { MutationResolvers, User } from '../generated/graphql'
import { IDeleteUserResult } from './sql/deleteUser'
import deleteUser from './sql/deleteUser.sql'
import { IDeleteUserInfoResult } from './sql/deleteUserInfo'
import deleteUserInfo from './sql/deleteUserInfo.sql'
import { IGetUserInfoResult } from './sql/getUserInfo'
import getUserInfo from './sql/getUserInfo.sql'
import updateUser from './sql/updateUser.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  logout: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    return {
      id: userId,
    } as User
  },

  unregister: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const { rows } = await poolQuery<IGetUserInfoResult>(getUserInfo, [userId])

    // 정지된 사용자면 재가입 방지를 위해 사용자 개인정보만 삭제
    if (rows[0].blocking_end_time) {
      const { rows: rows2 } = await poolQuery<IDeleteUserInfoResult>(deleteUserInfo, [userId])

      return {
        id: userId,
        blockingStartTime: rows2[0].blocking_start_time,
        blockingEndTime: rows[0].blocking_end_time,
      } as User
    }

    if (rows[0].oauth_kakao) unregisterKakaoUser(rows[0].oauth_kakao)
    // if (rows[0].oauth____) unregister___User(rows[0].oauth____)
    // if (rows[0].oauth____) unregister___User(rows[0].oauth____)
    // if (rows[0].oauth____) unregister___User(rows[0].oauth____)

    await poolQuery<IDeleteUserResult>(deleteUser, [userId])

    return {
      id: userId,
    } as User
  },

  updateUser: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const { rows } = await poolQuery(updateUser, [
      userId,
      input.bio,
      input.email,
      input.imageUrls?.map((imageUrl) => imageUrl.href),
      null,
      input.nickname,
      input.settings,
    ])

    return graphqlRelationMapping(rows[0])
  },
}
