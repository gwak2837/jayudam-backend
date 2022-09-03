import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import { getComments, getPosts, postORM } from './ORM'
import { ICommentsResult } from './sql/comments'
import comments from './sql/comments.sql'
import { IPostResult } from './sql/post'
import post from './sql/post.sql'
import { IPostsResult } from './sql/posts'
import posts from './sql/posts.sql'

export const Query: QueryResolvers<ApolloContext> = {
  comments: async (_, { parentId, lastId, limit }, { userId }) => {
    const { rowCount, rows } = await poolQuery<ICommentsResult>(comments, [
      parentId,
      userId,
      lastId ?? 0,
      limit ?? 20,
    ])

    if (rowCount === 0) return []

    return getComments(rows)
  },

  post: async (_, { id }, { userId }) => {
    const { rowCount, rows } = await poolQuery<IPostResult>(post, [id, userId])

    if (rowCount === 0) throw new NotFoundError('해당 글을 찾을 수 없어요')

    return postORM(rows[0])
  },

  posts: async (_, { lastId, limit }, { userId }) => {
    const { rows } = await poolQuery<IPostsResult>(posts, [
      userId,
      lastId ?? 9_223_372_036_854_775_807n,
      limit ?? 20,
    ])

    return getPosts(rows)
  },
}
