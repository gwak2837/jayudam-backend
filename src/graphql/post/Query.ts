import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers } from '../generated/graphql'
import { postORM } from './ORM'
import { IPostResult } from './sql/post'
import post from './sql/post.sql'

export const Query: QueryResolvers<ApolloContext> = {
  post: async (_, { id }) => {
    const { rowCount, rows } = await poolQuery<IPostResult>(post, [id])

    if (rowCount === 0) throw new NotFoundError('해당 글을 찾을 수 없어요')

    return postORM(rows)
  },
}
