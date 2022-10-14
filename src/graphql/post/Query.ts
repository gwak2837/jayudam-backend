import { poolQuery } from '../../common/postgres'
import { NotFoundError } from '../../fastify/errors'
import { GraphQLContext } from '../../routes'
import type { QueryResolvers } from '../generated/graphql'
import { getComments, getPosts, postORM } from './ORM'
import type { ICommentsResult } from './sql/comments'
import comments from './sql/comments.sql'
import type { IPostResult } from './sql/post'
import post from './sql/post.sql'
import type { IPostsResult } from './sql/posts'
import posts from './sql/posts.sql'

export const Query: QueryResolvers<GraphQLContext> = {
  comments: async (_, { parentId, lastId, limit }, { userId }) => {
    const { rowCount, rows } = await poolQuery<ICommentsResult>(comments, [
      parentId,
      userId,
      lastId ?? 0,
      limit ?? 20,
    ])

    if (rowCount === 0) return null

    return getComments(rows)
  },

  post: async (_, { id }, { userId }) => {
    const { rowCount, rows } = await poolQuery<IPostResult>(post, [id, userId])

    if (rowCount === 0) throw NotFoundError('해당 글을 찾을 수 없어요')

    return postORM(rows[0])
  },

  posts: async (_, { lastId, limit }, { userId }) => {
    const { rowCount, rows } = await poolQuery<IPostsResult>(posts, [
      userId,
      lastId ?? 9_223_372_036_854_775_807n,
      limit ?? 20,
    ])

    if (rowCount === 0) return null

    return getPosts(rows)
  },
}
