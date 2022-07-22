import { AuthenticationError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { Certs, QueryResolvers } from '../generated/graphql'
import { IVerificationHistoriesResult } from './sql/verificationHistories'
import verificationHistories from './sql/verificationHistories.sql'

export const Query: QueryResolvers<ApolloContext> = {
  verificationHistories: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IVerificationHistoriesResult>(verificationHistories, [userId])

    return rows.map((row) => ({
      id: row.id,
      creationTime: row.creation_time,
      ...JSON.parse(row.content),
    }))
  },
}