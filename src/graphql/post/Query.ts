import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import { postORM, postsORM } from './ORM'
import { IPostResult } from './sql/post'
import post from './sql/post.sql'
import { IPostsResult } from './sql/posts'
import posts from './sql/posts.sql'

export const Query: QueryResolvers<ApolloContext> = {
  post: async (_, { id }, { userId }) => {
    const { rowCount, rows } = await poolQuery<IPostResult>(post, [id, userId])

    if (rowCount === 0) throw new NotFoundError('해당 글을 찾을 수 없어요')

    return postORM(rows)
  },

  posts: async (_, { lastId }, { userId }) => {
    const { rows } = await poolQuery<IPostsResult>(posts, [
      userId,
      lastId ?? 9_223_372_036_854_775_807n,
    ])

    return postsORM(rows)
  },
}
