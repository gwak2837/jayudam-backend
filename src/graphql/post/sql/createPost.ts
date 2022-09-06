/** Types generated for queries found in "src/graphql/post/sql/createPost.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'CreatePost' parameters type */
export type ICreatePostParams = void

/** 'CreatePost' return type */
export interface ICreatePostResult {
  new_post: unknown | null
  reason: number | null
}

/** 'CreatePost' query type */
export interface ICreatePostQuery {
  params: ICreatePostParams
  result: ICreatePostResult
}

const createPostIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT reason,\n  new_post\nFROM create_post($1, $2, $3, $4, $5)',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT reason,
 *   new_post
 * FROM create_post($1, $2, $3, $4, $5)
 * ```
 */
export const createPost = new PreparedQuery<ICreatePostParams, ICreatePostResult>(createPostIR)
