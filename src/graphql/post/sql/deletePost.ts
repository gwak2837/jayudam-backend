/** Types generated for queries found in "src/graphql/post/sql/deletePost.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'DeletePost' parameters type */
export type IDeletePostParams = void;

/** 'DeletePost' return type */
export interface IDeletePostResult {
  creation_time: Date | null;
  deletion_time: Date | null;
  id: string;
  update_time: Date | null;
}

/** 'DeletePost' query type */
export interface IDeletePostQuery {
  params: IDeletePostParams;
  result: IDeletePostResult;
}

const deletePostIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE post\nSET deletion_time = CURRENT_TIMESTAMP,\n  content = NULL,\n  image_urls = NULL,\n  parent_post_id = NULL,\n  sharing_post_id = NULL\nWHERE id = $1\n  AND user_id = $2\nRETURNING id,\n  creation_time,\n  update_time,\n  deletion_time"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE post
 * SET deletion_time = CURRENT_TIMESTAMP,
 *   content = NULL,
 *   image_urls = NULL,
 *   parent_post_id = NULL,
 *   sharing_post_id = NULL
 * WHERE id = $1
 *   AND user_id = $2
 * RETURNING id,
 *   creation_time,
 *   update_time,
 *   deletion_time
 * ```
 */
export const deletePost = new PreparedQuery<IDeletePostParams,IDeletePostResult>(deletePostIR);


