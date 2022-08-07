import { AuthenticationError } from 'apollo-server-errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { MutationResolvers } from '../generated/graphql'
import { IToggleLikingPostResult } from './sql/toggleLikingPost'
import toggleLikingPost from './sql/toggleLikingPost.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  toggleLikingPost: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IToggleLikingPostResult>(toggleLikingPost, [userId, id])

    return {
      id,
      isLiked: Boolean(rows[0].result),
      likeCount: Number(rows[0].like_count),
    }
  },
}
