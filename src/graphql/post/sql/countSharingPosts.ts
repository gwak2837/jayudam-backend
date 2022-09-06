/** Types generated for queries found in "src/graphql/post/sql/countSharingPosts.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'CountSharingPosts' parameters type */
export type ICountSharingPostsParams = void

/** 'CountSharingPosts' return type */
export interface ICountSharingPostsResult {
  count: string | null
}

/** 'CountSharingPosts' query type */
export interface ICountSharingPostsQuery {
  params: ICountSharingPostsParams
  result: ICountSharingPostsResult
}

const countSharingPostsIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT COUNT(id)\nFROM post\nWHERE sharing_post_id = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(id)
 * FROM post
 * WHERE sharing_post_id = $1
 * ```
 */
export const countSharingPosts = new PreparedQuery<
  ICountSharingPostsParams,
  ICountSharingPostsResult
>(countSharingPostsIR)
