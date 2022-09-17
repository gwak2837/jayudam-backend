/** Types generated for queries found in "src/graphql/post/sql/deletePost.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'DeletePost' parameters type */
export type IDeletePostParams = void;

/** 'DeletePost' return type */
export interface IDeletePostResult {
  deletion_time: Date | null;
  has_authorized: boolean | null;
  image_urls: stringArray | null;
  is_deleted: boolean | null;
}

/** 'DeletePost' query type */
export interface IDeletePostQuery {
  params: IDeletePostParams;
  result: IDeletePostResult;
}

const deletePostIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT has_authorized,\n  is_deleted,\n  deletion_time,\n  image_urls\nFROM delete_post ($1, $2)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT has_authorized,
 *   is_deleted,
 *   deletion_time,
 *   image_urls
 * FROM delete_post ($1, $2)
 * ```
 */
export const deletePost = new PreparedQuery<IDeletePostParams,IDeletePostResult>(deletePostIR);


