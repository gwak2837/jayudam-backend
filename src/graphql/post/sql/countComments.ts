/** Types generated for queries found in "src/graphql/post/sql/countComments.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'CountComments' parameters type */
export type ICountCommentsParams = void

/** 'CountComments' return type */
export interface ICountCommentsResult {
  count: string | null
}

/** 'CountComments' query type */
export interface ICountCommentsQuery {
  params: ICountCommentsParams
  result: ICountCommentsResult
}

const countCommentsIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT COUNT(id)\nFROM post\nWHERE parent_post_id = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(id)
 * FROM post
 * WHERE parent_post_id = $1
 * ```
 */
export const countComments = new PreparedQuery<ICountCommentsParams, ICountCommentsResult>(
  countCommentsIR
)
