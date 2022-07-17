import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { signJWT, verifyJWT } from '../../utils/jwt'
import { Cert, MutationResolvers } from '../generated/graphql'
import { IGetCertsResult } from './sql/getCerts'
import getCerts from './sql/getCerts.sql'
import getCertsByDate from './sql/getCertsByDate.sql'
import { IUpdateCertAgreementResult } from './sql/updateCertAgreement'
import updateCertAgreement from './sql/updateCertAgreement.sql'
import useCherry from './sql/useCherry.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  updateCertAgreementAndGetCertJWT: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

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
    } = input

    await poolQuery<IUpdateCertAgreementResult>(updateCertAgreement, [
      userId,
      JSON.stringify({
        showBirthdate: showBirthdate ?? false,
        showName: showName ?? false,
        showSex: showSex ?? false,
        showSTDTestDetails: showSTDTestDetails ?? false,
        stdTestSince,
        showImmunizationDetails: showImmunizationDetails ?? false,
        immunizationSince,
        showSexualCrimeDetails: showSexualCrimeDetails ?? false,
        sexualCrimeSince,
      }),
    ])

    return await signJWT({ qrcode: true, userId, ...input }, '30s')
  },

  verifyCertJWT: async (_, { jwt }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const {
      qrcode,
      showBirthdate,
      showName,
      showSex,
      showSTDTestDetails,
      stdTestSince,
      showImmunizationDetails,
      immunizationSince,
      showSexualCrimeDetails,
      sexualCrimeSince,
      userId: targetUserId,
    } = await verifyJWT(jwt)
    if (!qrcode) throw new UserInputError('잘못된 JWT입니다')

    await poolQuery<IGetCertsResult>(useCherry, [userId]).catch(() => {
      throw new ForbiddenError('체리를 사용할 수 없습니다')
    })

    const certType = []
    if (showSTDTestDetails) certType.push(0)
    if (showImmunizationDetails) certType.push(1)
    if (showSexualCrimeDetails) certType.push(2)

    const minimumEffectiveDate = new Date(
      Math.min(stdTestSince, immunizationSince, sexualCrimeSince)
    )

    const { rows } = await poolQuery<IGetCertsResult>(
      stdTestSince && immunizationSince && sexualCrimeSince ? getCertsByDate : getCerts,
      stdTestSince && immunizationSince && sexualCrimeSince
        ? [targetUserId, certType, minimumEffectiveDate]
        : [targetUserId, certType]
    )

    return {} as Cert[]
  },
}
