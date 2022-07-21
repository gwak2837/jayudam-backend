import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { signJWT, verifyJWT } from '../../utils/jwt'
import { MutationResolvers } from '../generated/graphql'
import { ICertsResult } from './sql/certs'
import certs from './sql/certs.sql'
import { ICreateVerificationHistoriesResult } from './sql/createVerificationHistories'
import createVerificationHistories from './sql/createVerificationHistories.sql'
import { IUpdateCertAgreementResult } from './sql/updateCertAgreement'
import updateCertAgreement from './sql/updateCertAgreement.sql'
import { IUseCherryResult } from './sql/useCherry'
import useCherry from './sql/useCherry.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  updateCertAgreement: async (_, { input }, { userId }) => {
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

    const certAgreement = {
      ...(showBirthdate && { showBirthdate }),
      ...(showName && { showName }),
      ...(showSex && { showSex }),
      ...(showSTDTestDetails && { showSTDTestDetails }),
      ...(showSTDTestDetails &&
        stdTestSince && { stdTestSince: stdTestSince.toISOString().substring(0, 10) }),
      ...(showImmunizationDetails && { showImmunizationDetails }),
      ...(showImmunizationDetails &&
        immunizationSince && {
          immunizationSince: immunizationSince.toISOString().substring(0, 10),
        }),
      ...(showSexualCrimeDetails && { showSexualCrimeDetails }),
      ...(showSexualCrimeDetails &&
        sexualCrimeSince && { sexualCrimeSince: sexualCrimeSince.toISOString().substring(0, 10) }),
    }

    await poolQuery<IUpdateCertAgreementResult>(updateCertAgreement, [
      userId,
      Object.keys(certAgreement).length === 0 ? null : JSON.stringify(certAgreement),
    ])

    return await signJWT({ qrcode: true, userId, ...certAgreement }, '1d')
  },

  verifyCertJWT: async (_, { jwt }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const {
      qrcode,
      userId: targetUserId,
      showBirthdate,
      showName,
      showSex,
      showSTDTestDetails,
      stdTestSince,
      showImmunizationDetails,
      immunizationSince,
      showSexualCrimeDetails,
      sexualCrimeSince,
    } = await verifyJWT(jwt)
    if (!qrcode) throw new UserInputError('잘못된 JWT입니다')

    if (
      !showBirthdate &&
      !showName &&
      !showSex &&
      !showSTDTestDetails &&
      !showImmunizationDetails &&
      !showSexualCrimeDetails
    )
      throw new UserInputError('하나 이상의 정보 제공 동의가 필요합니다')

    // if (userId === targetUserId) throw new UserInputError('본인의 QR code 입니다')

    await poolQuery<IUseCherryResult>(useCherry, [userId]).catch(() => {
      throw new ForbiddenError('체리를 사용할 수 없습니다')
    })

    const certType = []
    if (showSTDTestDetails) certType.push(0, 1)
    if (showImmunizationDetails) certType.push(2)
    if (showSexualCrimeDetails) certType.push(3)

    const { rowCount, rows } = await poolQuery<ICertsResult>(certs, [
      targetUserId,
      certType,
      stdTestSince ?? '1900-01-01',
      immunizationSince ?? '1900-01-01',
      sexualCrimeSince ?? '1900-01-01',
    ])

    if (rowCount === 0) return null

    const results = rows.map((cert) => ({
      id: cert.id,
      ...(showBirthdate && { birthdate: cert.birthdate }),
      content: cert.content,
      effectiveDate: cert.effective_date,
      issueDate: cert.issue_date,
      ...(showName && { name: cert.name }),
      ...(showSex && { sex: cert.sex }),
      type: cert.type,
    }))

    await poolQuery<ICreateVerificationHistoriesResult>(createVerificationHistories, [
      JSON.stringify(results),
      userId,
    ])

    return results
  },
}
