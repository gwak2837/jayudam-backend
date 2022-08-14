/** Types generated for queries found in "src/graphql/post/sql/hasDuplicateSharingPost.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'HasDuplicateSharingPost' parameters type */
export type IHasDuplicateSharingPostParams = void;

/** 'HasDuplicateSharingPost' return type */
export interface IHasDuplicateSharingPostResult {
  id: string;
}

/** 'HasDuplicateSharingPost' query type */
export interface IHasDuplicateSharingPostQuery {
  params: IHasDuplicateSharingPostParams;
  result: IHasDuplicateSharingPostResult;
}

const hasDuplicateSharingPostIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id\nFROM post\nWHERE user_id = $1\n  AND parent_post_id = $2"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id
 * FROM post
 * WHERE user_id = $1
 *   AND parent_post_id = $2
 * ```
 */
export const hasDuplicateSharingPost = new PreparedQuery<IHasDuplicateSharingPostParams,IHasDuplicateSharingPostResult>(hasDuplicateSharingPostIR);


