/** Types generated for queries found in "src/graphql/post/sql/sharingPost.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'SharingPost' parameters type */
export type ISharingPostParams = void

/** 'SharingPost' return type */
export interface ISharingPostResult {
  id: string
}

/** 'SharingPost' query type */
export interface ISharingPostQuery {
  params: ISharingPostParams
  result: ISharingPostResult
}

const sharingPostIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT id\nFROM post\nWHERE sharing_post_id = $1\n  AND user_id = $2',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id
 * FROM post
 * WHERE sharing_post_id = $1
 *   AND user_id = $2
 * ```
 */
export const sharingPost = new PreparedQuery<ISharingPostParams, ISharingPostResult>(sharingPostIR)
