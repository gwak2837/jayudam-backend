import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { signJWT, verifyJWT } from '../../utils/jwt'
import { Certificate, QueryResolvers } from '../generated/graphql'
import { IGetCertificatesResult } from './sql/getCertificates'
import getCertificates from './sql/getCertificates.sql'
import useCherry from './sql/useCherry.sql'

// import myPosts from './sql/myPosts.sql'

export const Query: QueryResolvers<ApolloContext> = {
  getCertificateJWT: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    return await signJWT({ qrcode: true, userId, ...input }, '30s')
  },

  verifyCertificateJWT: async (_, { jwt }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const decodedJWT = await verifyJWT(jwt)
    if (!decodedJWT.qrcode) throw new UserInputError('잘못된 JWT입니다')

    await poolQuery<IGetCertificatesResult>(useCherry, [userId]).catch(() => {
      throw new ForbiddenError('체리를 사용할 수 없습니다')
    })

    const a = await poolQuery<IGetCertificatesResult>(getCertificates, [decodedJWT.userId])

    return {} as Certificate
  },
}
