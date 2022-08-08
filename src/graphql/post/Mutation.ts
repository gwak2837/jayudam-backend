import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { MutationResolvers, Post } from '../generated/graphql'
import { IToggleLikingPostResult } from './sql/toggleLikingPost'
import createPost from './sql/createPost.sql'
import toggleLikingPost from './sql/toggleLikingPost.sql'
import { ICreatePostResult } from './sql/createPost'

export const Mutation: MutationResolvers<ApolloContext> = {
  createPost: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { content, imageUrls, parentPostId, sharingPostId } = input

    if (parentPostId && sharingPostId)
      throw new UserInputError('parentPostId, sharingPostId 중 하나만 입력해주세요')

    const { rows } = await poolQuery<ICreatePostResult>(createPost, [
      content,
      imageUrls?.map((url) => url.href),
      parentPostId,
      sharingPostId,
      userId,
    ])
    const newPost = rows[0]

    return {
      id: newPost.id,
      creationTime: newPost.creation_time,
      content,
      imageUrls,
      sharingPost: {
        id: sharingPostId,
      },
      author: {
        id: userId,
      },
    } as Post
  },

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
