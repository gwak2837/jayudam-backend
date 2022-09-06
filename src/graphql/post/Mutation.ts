import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { MutationResolvers, Post, PostCreationResult } from '../generated/graphql'
import { ICountCommentsResult } from './sql/countComments'
import countComments from './sql/countComments.sql'
import countSharingPosts from './sql/countSharingPosts.sql'
import { ICreatePostResult } from './sql/createPost'
import createPost from './sql/createPost.sql'
import { IDeletePostResult } from './sql/deletePost'
import deletePost from './sql/deletePost.sql'
import { ISharingPostResult } from './sql/sharingPost'
import sharingPost from './sql/sharingPost.sql'
import { IToggleLikingPostResult } from './sql/toggleLikingPost'
import toggleLikingPost from './sql/toggleLikingPost.sql'

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
        creationTime: new Date(newPost[1]),
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

    const { rows } = await poolQuery<IDeletePostResult>(deletePost, [id, userId])

    const deletedPost = rows[0]

    if (!deletedPost.has_authorized)
      throw new ForbiddenError('존재하지 않는 이야기거나 자신의 이야기가 아닙니다')

    if (deletedPost.is_deleted)
      return {
        id,
      } as Post

    return {
      id,
      deletionTime: deletedPost.deletion_time,
      content: null,
      imageUrls: null,
      sharingPost: null,
      parentPost: null,
    } as Post
  },

  deleteSharingPost: async (_, { sharedPostId }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rowCount, rows: rows2 } = await poolQuery<ISharingPostResult>(sharingPost, [
      sharedPostId,
      userId,
    ])

    if (rowCount === 0)
      throw new ForbiddenError('존재하지 않는 이야기거나 자신의 이야기가 아닙니다')

    const { rows } = await poolQuery<IDeletePostResult>(deletePost, [rows2[0].id, userId])

    const deletedPost = rows[0]

    if (!deletedPost.has_authorized)
      throw new ForbiddenError('존재하지 않는 이야기거나 자신의 이야기가 아닙니다')

    const { rows: rows3 } = await poolQuery<ICountCommentsResult>(countSharingPosts, [sharedPostId])

    const sharedPost = {
      id: sharedPostId,
      sharedCount: rows3[0].count,
      doIShare: false,
    } as Post

    if (deletedPost.is_deleted)
      return {
        deletedPost: {
          id: rows2[0].id,
        } as Post,
        sharedPost,
      }

    return {
      deletedPost: {
        id: rows2[0].id,
        deletionTime: deletedPost.deletion_time,
        content: null,
        imageUrls: null,
        sharingPost: null,
        parentPost: null,
      } as Post,
      sharedPost,
    }
  },

  toggleLikingPost: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IToggleLikingPostResult>(toggleLikingPost, [userId, id])

    if (rows[0].like === null) throw new UserInputError('삭제된 글은 좋아할 수 없습니다')

    return {
      id,
      isLiked: Boolean(rows[0].like),
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
