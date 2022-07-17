import { AuthenticationError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { CertAgreement, QueryResolvers, User } from '../generated/graphql'
import { IGetMyCertAgreementResult } from './sql/getMyCertAgreement'
import getMyCertAgreement from './sql/getMyCertAgreement.sql'
import { IIsUniqueNicknameResult } from './sql/isUniqueNickname'
import isUniqueNickname from './sql/isUniqueNickname.sql'
import { IMeResult } from './sql/me'
import me from './sql/me.sql'

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
      showBirthdate,
      showName,
      showSex,
      showSTDTestDetails,
      stdTestSince,
      showImmunizationDetails,
      immunizationSince,
      showSexualCrimeDetails,
      sexualCrimeSince,
    }
  },

  isUniqueNickname: async (_, { nickname }) => {
    const { rowCount } = await poolQuery<IIsUniqueNicknameResult>(isUniqueNickname, [nickname])

    return rowCount === 0
  },

  myNickname: async (_, __, { userId }) => {
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
