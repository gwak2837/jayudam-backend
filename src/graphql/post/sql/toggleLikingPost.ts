/** Types generated for queries found in "src/graphql/post/sql/toggleLikingPost.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'ToggleLikingPost' parameters type */
export type IToggleLikingPostParams = void

/** 'ToggleLikingPost' return type */
export interface IToggleLikingPostResult {
  like: boolean | null
  like_count: number | null
}

/** 'ToggleLikingPost' query type */
export interface IToggleLikingPostQuery {
  params: IToggleLikingPostParams
  result: IToggleLikingPostResult
}

const toggleLikingPostIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT "like",\n  like_count\nFROM toggle_liking_post($1, $2)',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT "like",
 *   like_count
 * FROM toggle_liking_post($1, $2)
 * ```
 */
export const toggleLikingPost = new PreparedQuery<IToggleLikingPostParams, IToggleLikingPostResult>(
  toggleLikingPostIR
)
