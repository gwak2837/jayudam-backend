import { AuthenticationError, UserInputError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { unregisterKakaoUser } from '../../express/oauth/kakao'
import { KAKAO_REST_API_KEY } from '../../utils/constants'
import { MutationResolvers, User } from '../generated/graphql'
import { IDeleteUserResult } from './sql/deleteUser'
import deleteUser from './sql/deleteUser.sql'
import { IDeleteUserInfoResult } from './sql/deleteUserInfo'
import deleteUserInfo from './sql/deleteUserInfo.sql'
import { IGetUserInfoResult } from './sql/getUserInfo'
import getUserInfo from './sql/getUserInfo.sql'
import { IUpdateUserResult } from './sql/updateUser'
import updateUser from './sql/updateUser.sql'
import { IVerifyTownResult } from './sql/verifyTown'
import verifyTown from './sql/verifyTown.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  logout: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    return {
      id: userId,
    } as User
  },

  unregister: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

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

    // OAuth 연결 해제
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
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    if (Object.keys(input).length === 0) throw new UserInputError('하나 이상 입력해주세요')

    const { rows } = await poolQuery<IUpdateUserResult>(updateUser, [
      userId,
      input.bio,
      JSON.stringify(input.certificateAgreement),
      input.email,
      input.imageUrls?.map((imageUrl) => imageUrl.href),
      input.nickname,
      input.town1Name,
      input.town2Name,
    ])

    return {
      id: userId,
      ...(input.bio && { bio: rows[0].bio }),
      ...(input.certificateAgreement && {
        certificateAgreement: rows[0].certificate_agreement
          ? JSON.parse(rows[0].certificate_agreement)
          : null,
      }),
      ...(input.email && { email: rows[0].email }),
      ...(input.imageUrls && { imageUrls: rows[0].image_urls }),
      ...(input.nickname && { nickname: rows[0].nickname }),
      ...(input.town1Name && { town1Name: rows[0].town1_name }),
      ...(input.town2Name && { town2Name: rows[0].town2_name }),
    } as User
  },

  verifyTown: async (_, { lat, lon }, { userId }) => {
    // if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { documents } = await getLegalTownName(lat, lon)
    if (!documents) throw new UserInputError('해당 주소를 찾을 수 없습니다')

    const legalTown = documents.find((document) => document.region_type === 'B')
    if (!legalTown?.region_3depth_name) throw new UserInputError('해당 주소를 찾을 수 없습니다')

    const { rows } = await poolQuery<IVerifyTownResult>(verifyTown, [
      userId,
      `${legalTown.region_2depth_name} ${legalTown.region_3depth_name}`,
    ])

    return {
      id: userId,
      towns: [
        { count: rows[0].town1_count, name: rows[0].town1_name },
        { count: rows[0].town2_count, name: rows[0].town2_name },
      ],
    } as User
  },
}

async function getLegalTownName(lat: any, lon: any) {
  const querystring = new URLSearchParams({
    x: lon,
    y: lat,
  })
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?${querystring}`,
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    }
  )
  return response.json() as Promise<{
    meta: Record<string, any>
    documents: Record<string, any>[]
  }>
}
