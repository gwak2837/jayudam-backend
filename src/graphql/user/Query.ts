import { AuthenticationError, UserInputError } from 'apollo-server-errors'

import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers, User } from '../generated/graphql'
import { IAuthResult } from './sql/auth'
import auth from './sql/auth.sql'
import { IGetMyCertAgreementResult } from './sql/getMyCertAgreement'
import getMyCertAgreement from './sql/getMyCertAgreement.sql'
import { IIsUniqueUsernameResult } from './sql/isUniqueUsername'
import isUniqueUsername from './sql/isUniqueUsername.sql'
import { IMeResult } from './sql/me'
import me from './sql/me.sql'
import { IUserByNameResult } from './sql/userByName'
import userByName from './sql/userByName.sql'

export const Query: QueryResolvers<ApolloContext> = {
  auth: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IAuthResult>(auth, [userId])

    return {
      id: rows[0].id,
      name: rows[0].name,
    } as User
  },

  myCertAgreement: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IGetMyCertAgreementResult>(getMyCertAgreement, [userId])
    if (!rows[0].cert_agreement)
      return {
        showBirthdate: false,
        showLegalName: false,
        showSex: false,
        showSTDTest: false,
        showImmunization: false,
        showSexualCrime: false,
      }

    const {
      showBirthdate,
      showLegalName,
      showSex,
      showSTDTest,
      stdTestSince,
      showImmunization,
      immunizationSince,
      showSexualCrime,
      sexualCrimeSince,
    } = JSON.parse(rows[0].cert_agreement)

    return {
      showBirthdate: showBirthdate ?? false,
      showLegalName: showLegalName ?? false,
      showSex: showSex ?? false,
      showSTDTest: showSTDTest ?? false,
      ...(showSTDTest && stdTestSince && { stdTestSince }),
      showImmunization: showImmunization ?? false,
      ...(showImmunization && immunizationSince && { immunizationSince }),
      showSexualCrime: showSexualCrime ?? false,
      ...(showSexualCrime && sexualCrimeSince && { sexualCrimeSince }),
    }
  },

  isUniqueUsername: async (_, { username }) => {
    const { rowCount } = await poolQuery<IIsUniqueUsernameResult>(isUniqueUsername, [username])

    return rowCount === 0
  },

  user: async (_, { name }, { userId }) => {
    if (!name && !userId) throw new AuthenticationError('로그인 후 시도해주세요')

    if (name === 'undefined' || name === 'null')
      throw new UserInputError('허용되지 않는 닉네임입니다')

    if (name) {
      const { rowCount, rows } = await poolQuery<IUserByNameResult>(userByName, [name])
      if (rowCount === 0) throw new NotFoundError(`\`${name}\` 사용자를 찾을 수 없습니다`)

      return {
        bio: rows[0].bio,
        blockingStartTime: rows[0].blocking_start_time,
        blockingEndTime: rows[0].blocking_end_time,
        grade: rows[0].grade,
        imageUrls: rows[0].image_urls,
        isVerifiedSex: rows[0].is_verified_sex,
        name: rows[0].name,
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
        name: rows[0].name,
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
