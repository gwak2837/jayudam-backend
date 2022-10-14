import { signJWT, verifyJWT } from '../../common/jwt'
import { poolQuery } from '../../common/postgres'
import { BadRequestError, ForbiddenError, UnauthorizedError } from '../../fastify/errors'
import { GraphQLContext } from '../../routes'
import { defaultDate } from '../../utils'
import { Cert, CertType, MutationResolvers } from '../generated/graphql'
import { decodeSex } from '../user/Object'
import { decodeCertType } from './Object'
import type { ICertsResult } from './sql/certs'
import certs from './sql/certs.sql'
import type { ICreateVerificationHistoryResult } from './sql/createVerificationHistory'
import createVerificationHistory from './sql/createVerificationHistory.sql'
import type { IUpdateCertAgreementResult } from './sql/updateCertAgreement'
import updateCertAgreement from './sql/updateCertAgreement.sql'
import type { IUseCherryResult } from './sql/useCherry'
import useCherry from './sql/useCherry.sql'

export const Mutation: MutationResolvers<GraphQLContext> = {
  certJWT: async (_, { input }, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

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
    } = input

    const future = new Date()
    future.setHours(future.getHours() + 1)

    if (stdTestSince > future || immunizationSince > future || sexualCrimeSince > future)
      throw BadRequestError('날짜를 미래로 지정할 수 없습니다')

    const certAgreement = {
      ...(showBirthdate && { showBirthdate }),
      ...(showLegalName && { showLegalName }),
      ...(showSex && { showSex }),
      ...(showSTDTest && { showSTDTest }),
      ...(showSTDTest && stdTestSince && { stdTestSince }),
      ...(showImmunization && { showImmunization }),
      ...(showImmunization && immunizationSince && { immunizationSince }),
      ...(showSexualCrime && { showSexualCrime }),
      ...(showSexualCrime && sexualCrimeSince && { sexualCrimeSince }),
    }

    await poolQuery(updateCertAgreement, [
      userId,
      Object.keys(certAgreement).length === 0 ? null : JSON.stringify(certAgreement),
    ])

    return await signJWT({ qrcode: true, userId, ...certAgreement }, '15s')
  },

  submitCert: async (_, { input }, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    // encode Sex

    return {} as Cert
  },

  verifyCertJWT: async (_, { jwt }, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const {
      qrcode,
      forTest,
      userId: targetUserId,
      showBirthdate,
      showLegalName,
      showSex,
      showSTDTest,
      stdTestSince,
      showImmunization,
      immunizationSince,
      showSexualCrime,
      sexualCrimeSince,
    } = await verifyJWT(jwt)
    if (!qrcode) throw BadRequestError('잘못된 JWT입니다')

    if (
      !showBirthdate &&
      !showLegalName &&
      !showSex &&
      !showSTDTest &&
      !showImmunization &&
      !showSexualCrime
    )
      throw BadRequestError('하나 이상의 정보 제공 동의가 필요합니다')

    if (userId === targetUserId) throw BadRequestError('본인의 QR code 입니다')

    const certType = []
    if (showSTDTest) certType.push(0, 1)
    if (showImmunization) certType.push(2)
    if (showSexualCrime) certType.push(3)

    const { rowCount, rows } = await poolQuery<ICertsResult>(certs, [
      targetUserId,
      certType,
      stdTestSince ?? defaultDate,
      immunizationSince ?? defaultDate,
      sexualCrimeSince ?? defaultDate,
    ])

    const allCerts = rows.map((cert) => ({
      id: cert.id,
      content: cert.content,
      effectiveDate: cert.effective_date,
      issueDate: cert.issue_date,
      location: cert.location,
      name: cert.name,
      type: decodeCertType(cert.type),
    }))

    const results = {
      ...(showBirthdate && { birthdate: rows[0].birthdate }),
      ...(showLegalName && { legalName: rows[0].legal_name }),
      ...(showSex && { sex: decodeSex(rows[0].sex) }),
      ...(showSTDTest && {
        stdTestCerts: allCerts.filter(
          (cert) => cert.type === CertType.ClinicalLaboratoryTest || cert.type === CertType.StdTest
        ),
      }),
      ...(showImmunization && {
        immunizationCerts: allCerts.filter((cert) => cert.type === CertType.Immunization),
      }),
      ...(showSexualCrime && {
        sexualCrimeCerts: allCerts.filter((cert) => cert.type === CertType.SexualCrime),
      }),
    }

    if (forTest) {
      return {
        id: -1,
        creationTime: new Date(0),
        ...results,
      }
    }

    const { rows: rows2 } = await poolQuery<ICreateVerificationHistoryResult>(
      createVerificationHistory,
      [JSON.stringify(results), userId]
    )

    if (rowCount === 0)
      return {
        id: rows2[0].id,
        creationTime: rows2[0].creation_time,
        ...results,
      }

    await poolQuery(useCherry, [userId]).catch(() => {
      throw ForbiddenError('체리를 사용할 수 없습니다')
    })

    return {
      id: rows2[0].id,
      creationTime: rows2[0].creation_time,
      ...results,
    }
  },
}
