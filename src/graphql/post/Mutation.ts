import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { MutationResolvers, Post, PostCreationResult } from '../generated/graphql'
import { IToggleLikingPostResult } from './sql/toggleLikingPost'
import createPost from './sql/createPost.sql'
import toggleLikingPost from './sql/toggleLikingPost.sql'

import deletePost from './sql/deletePost.sql'
import countComments from './sql/countComments.sql'
import countSharingPosts from './sql/countSharingPosts.sql'
import { ICreatePostResult } from './sql/createPost'

import { IDeletePostResult } from './sql/deletePost'
import { ICountCommentsResult } from './sql/countComments'

export const Mutation: MutationResolvers<ApolloContext> = {
  createPost: async (_, { input }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { content, imageUrls, parentPostId, sharingPostId } = input

    if (parentPostId && sharingPostId)
      throw new UserInputError('parentPostId, sharingPostId 중 하나만 입력해주세요')

    if (!sharingPostId && (!content || content.length === 0))
      throw new UserInputError('content를 입력해주세요')

    const { rows } = await poolQuery<ICreatePostResult>(createPost, [
      content,
      imageUrls?.map((url) => url.href),
      parentPostId,
      sharingPostId,
      userId,
    ])
    const failedReason = rows[0].reason

    if (failedReason) throw new UserInputError(getPostCreationFailedReason(failedReason))

    const newPost = (rows[0].new_post as string).slice(1, -1).split(',')
    const result: PostCreationResult = {
      newPost: {
        id: newPost[0],
        creationTime: newPost[1],
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
    }

    if (parentPostId) {
      const { rows } = await poolQuery<ICountCommentsResult>(countComments, [parentPostId])

      result.parentPost = {
        id: parentPostId,
        doIComment: true,
        commentCount: rows[0].count,
      } as Post
    } else if (sharingPostId) {
      const { rows } = await poolQuery<ICountCommentsResult>(countSharingPosts, [sharingPostId])

      result.sharedPost = {
        id: sharingPostId,
        doIShare: true,
        sharedCount: rows[0].count,
      } as Post
    }

    return result
  },

  deletePost: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rowCount, rows } = await poolQuery<IDeletePostResult>(deletePost, [id, userId])

    if (rowCount === 0)
      throw new AuthenticationError('존재하지 않는 이야기거나 자신의 이야기가 아닙니다')

    const deletedPost = rows[0]

    return {
      id,
      deletionTime: deletedPost.deletion_time,
      content: null,
      imageUrls: null,
      sharingPost: null,
      parentAuthor: null,
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

function getPostCreationFailedReason(code: number) {
  switch (code) {
    case 1:
      return '삭제된 글에 댓글을 달 수 없습니다'
    case 2:
      return '2번 이상 공유할 수 없습니다'
    case 3:
      return '삭제된 글을 공유할 수 없습니다'
    default:
      return '글을 작성할 수 없습니다'
  }
}
