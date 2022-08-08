/** Types generated for queries found in "src/graphql/post/sql/createPost.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreatePost' parameters type */
export type ICreatePostParams = void;

/** 'CreatePost' return type */
export interface ICreatePostResult {
  creation_time: Date | null;
  id: string;
}

/** 'CreatePost' query type */
export interface ICreatePostQuery {
  params: ICreatePostParams;
  result: ICreatePostResult;
}

const createPostIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO post (\n    content,\n    image_urls,\n    parent_post_id,\n    sharing_post_id,\n    user_id\n  )\nVALUES ($1, $2, $3, $4, $5)\nRETURNING id,\n  creation_time"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO post (
 *     content,
 *     image_urls,
 *     parent_post_id,
 *     sharing_post_id,
 *     user_id
 *   )
 * VALUES ($1, $2, $3, $4, $5)
 * RETURNING id,
 *   creation_time
 * ```
 */
export const createPost = new PreparedQuery<ICreatePostParams,ICreatePostResult>(createPostIR);


