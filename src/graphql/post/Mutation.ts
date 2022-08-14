import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { MutationResolvers, Post } from '../generated/graphql'
import { IToggleLikingPostResult } from './sql/toggleLikingPost'
import createPost from './sql/createPost.sql'
import toggleLikingPost from './sql/toggleLikingPost.sql'
import hasDuplicateSharingPost from './sql/hasDuplicateSharingPost.sql'
import deletePost from './sql/deletePost.sql'
import { ICreatePostResult } from './sql/createPost'
import { IHasDuplicateSharingPostResult } from './sql/hasDuplicateSharingPost'
import { IDeletePostResult } from './sql/deletePost'

export const Mutation: MutationResolvers<ApolloContext> = {
  createPost: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { content, imageUrls, parentPostId, sharingPostId } = input

    if (parentPostId && sharingPostId)
      throw new UserInputError('parentPostId, sharingPostId 중 하나만 입력해주세요')

    if (sharingPostId) {
      const { rowCount } = await poolQuery<IHasDuplicateSharingPostResult>(
        hasDuplicateSharingPost,
        [userId, sharingPostId]
      )

      if (rowCount > 0) throw new UserInputError('같은 이야기를 2번 이상 공유할 수 없습니다')
    }

    const { rows } = await poolQuery<ICreatePostResult>(createPost, [
      content,
      imageUrls?.map((url) => url.href),
      parentPostId,
      sharingPostId,
      userId,
    ])
    const newPost = rows[0]

    return {
      newPost: {
        id: newPost.id,
        creationTime: newPost.creation_time,
        content,
        imageUrls,
        isLiked: false,
        doIComment: false,
        doIShare: false,
        ...(sharingPostId && {
          sharedPost: {
            id: sharingPostId,
          } as Post,
        }),
        author: {
          id: userId,
        },
      } as Post,
      ...(parentPostId && {
        parentPost: {
          id: parentPostId,
          doIComment: true,
        } as Post,
      }),
      ...(sharingPostId && {
        sharedPost: {
          id: sharingPostId,
          doIShare: true,
        } as Post,
      }),
    }
  },

  deletePost: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rowCount } = await poolQuery<IDeletePostResult>(deletePost, [userId, id])

    if (rowCount === 0)
      throw new AuthenticationError('존재하지 않는 이야기거나 자신의 이야기가 아닙니다')

    return {
      id,
      creationTime: null,
      updateTime: null,
      deletionTime: '',
      content: null,
    } as Post
  },

  toggleLikingPost: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IToggleLikingPostResult>(toggleLikingPost, [userId, id])

    return {
      id,
      isLiked: Boolean(rows[0].result),
      likeCount: Number(rows[0].like_count),
    } as Post
  },
}
