import { UnauthorizedError } from '../../common/fastify'
import { signJWT } from '../../common/jwt'
import { poolQuery } from '../../common/postgres'
import { GraphQLContext } from '../../routes'
import type { QueryResolvers } from '../generated/graphql'
import type { IVerificationHistoriesResult } from './sql/verificationHistories'
import verificationHistories from './sql/verificationHistories.sql'

export const Query: QueryResolvers<GraphQLContext> = {
  sampleCertJWT: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    return await signJWT(
      {
        qrcode: true,
        forTest: true,
        userId: '0',
        showBirthdate: true,
        showLegalName: true,
        showSex: true,
        showSTDTest: true,
        showImmunization: true,
        showSexualCrime: true,
      },
      '30s'
    )
  },

  verificationHistories: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IVerificationHistoriesResult>(verificationHistories, [userId])

    return rows.map((row) => ({
      id: row.id,
      creationTime: row.creation_time,
      ...JSON.parse(row.content),
    }))
  },
}
