import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { Post, QueryResolvers } from '../generated/graphql'
import { IPostResult } from './sql/post'
import post from './sql/post.sql'

export const Query: QueryResolvers<ApolloContext> = {
  post: async (_, { id }) => {
    const { rows } = await poolQuery<IPostResult>(post, [id])

    return {} as Post
  },
}
