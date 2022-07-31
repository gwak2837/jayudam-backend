/** Types generated for queries found in "src/graphql/post/sql/post.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Post' parameters type */
export type IPostParams = void;

/** 'Post' return type */
export interface IPostResult {
  id: string;
}

/** 'Post' query type */
export interface IPostQuery {
  params: IPostParams;
  result: IPostResult;
}

const postIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT parent_post.id\nFROM post AS parent_post\n  LEFT JOIN post ON post.parent_post_id = parent_post.id\n  LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id\n  LEFT JOIN \"user\" ON \"user\".id = post.user_id\n  LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id\nWHERE parent_post.id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT parent_post.id
 * FROM post AS parent_post
 *   LEFT JOIN post ON post.parent_post_id = parent_post.id
 *   LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id
 *   LEFT JOIN "user" ON "user".id = post.user_id
 *   LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id
 * WHERE parent_post.id = $1
 * ```
 */
export const post = new PreparedQuery<IPostParams,IPostResult>(postIR);


