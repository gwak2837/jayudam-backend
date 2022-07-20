import { AuthenticationError, UserInputError } from 'apollo-server-errors'

import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { CertAgreement, QueryResolvers, Sex, User } from '../generated/graphql'
import { IGetMyCertAgreementResult } from './sql/getMyCertAgreement'
import getMyCertAgreement from './sql/getMyCertAgreement.sql'
import { IIsUniqueNicknameResult } from './sql/isUniqueNickname'
import isUniqueNickname from './sql/isUniqueNickname.sql'
import { IMeResult } from './sql/me'
import me from './sql/me.sql'
import { IMyNicknameResult } from './sql/myNickname'
import myNickname from './sql/myNickname.sql'
import { IUserByNicknameResult } from './sql/userByNickname'
import userByNickname from './sql/userByNickname.sql'

export const Query: QueryResolvers<ApolloContext> = {
  myCertAgreement: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IGetMyCertAgreementResult>(getMyCertAgreement, [userId])
    if (!rows[0].cert_agreement)
      return {
        showBirthdate: false,
        showName: false,
        showSex: false,
        showSTDTestDetails: false,
        showImmunizationDetails: false,
        showSexualCrimeDetails: false,
      }

    const {
      showBirthdate,
      showName,
      showSex,
      showSTDTestDetails,
      stdTestSince,
      showImmunizationDetails,
      immunizationSince,
      showSexualCrimeDetails,
      sexualCrimeSince,
    } = JSON.parse(rows[0].cert_agreement)

    return {
      showBirthdate: showBirthdate ?? false,
      showName: showName ?? false,
      showSex: showSex ?? false,
      showSTDTestDetails: showSTDTestDetails ?? false,
      ...(showSTDTestDetails && stdTestSince && { stdTestSince }),
      showImmunizationDetails: showImmunizationDetails ?? false,
      ...(showImmunizationDetails && immunizationSince && { immunizationSince }),
      showSexualCrimeDetails: showSexualCrimeDetails ?? false,
      ...(showSexualCrimeDetails && sexualCrimeSince && { sexualCrimeSince }),
    }
  },

  isUniqueNickname: async (_, { nickname }) => {
    const { rowCount } = await poolQuery<IIsUniqueNicknameResult>(isUniqueNickname, [nickname])

    return rowCount === 0
  },

  myNickname: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IMyNicknameResult>(myNickname, [userId])

    return {
      id: rows[0].id,
      nickname: rows[0].nickname,
    } as User
  },

  user: async (_, { nickname }, { userId }) => {
    if (!nickname && !userId) throw new UserInputError('잘못된 요청입니다')

    if (nickname === 'undefined' || nickname === 'null')
      throw new UserInputError('허용되지 않는 닉네임입니다')

    if (nickname) {
      const { rowCount, rows } = await poolQuery<IUserByNicknameResult>(userByNickname, [nickname])
      if (rowCount === 0) throw new NotFoundError(`\`${nickname}\` 사용자를 찾을 수 없습니다`)

      return {
        bio: rows[0].bio,
        blockingStartTime: rows[0].blocking_start_time,
        blockingEndTime: rows[0].blocking_end_time,
        grade: rows[0].grade,
        imageUrls: rows[0].image_urls,
        isVerifiedSex: rows[0].is_verified_sex,
        nickname: rows[0].nickname,
        sex: rows[0].sex,
        towns: [
          { count: rows[0].town1_count, name: rows[0].town1_name },
          { count: rows[0].town2_count, name: rows[0].town2_name },
        ],
      } as User
    } else {
      const { rowCount, rows } = await poolQuery<IMeResult>(me, [userId])
      if (rowCount === 0) throw new NotFoundError('탈퇴했거나 존재하지 않는 사용자입니다')

      return {
        id: rows[0].id,
        bio: rows[0].bio,
        blockingStartTime: rows[0].blocking_start_time,
        blockingEndTime: rows[0].blocking_end_time,
        cherry: rows[0].cherry,
        grade: rows[0].grade,
        imageUrls: rows[0].image_urls,
        isVerifiedSex: rows[0].is_verified_sex,
        nickname: rows[0].nickname,
        sex: rows[0].sex,
        towns: [
          { count: rows[0].town1_count, name: rows[0].town1_name },
          { count: rows[0].town2_count, name: rows[0].town2_name },
        ],
      } as User
    }
  },
}
