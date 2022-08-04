/** Types generated for queries found in "src/graphql/post/sql/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'Posts' parameters type */
export type IPostsParams = void;

/** 'Posts' return type */
export interface IPostsResult {
  post__comment_count: string | null;
  post__content: string | null;
  post__creation_time: Date | null;
  post__deletion_time: Date | null;
  post__id: string;
  post__image_urls: stringArray | null;
  post__like_count: string | null;
  post__shared_count: string | null;
  post__update_time: Date | null;
  post__user__id: string;
  post__user__image_url: string | null;
  post__user__name: string | null;
  post__user__nickname: string | null;
}

/** 'Posts' query type */
export interface IPostsQuery {
  params: IPostsParams;
  result: IPostsResult;
}

const postsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT post.id AS post__id,\n  post.creation_time AS post__creation_time,\n  post.update_time AS post__update_time,\n  post.deletion_time AS post__deletion_time,\n  post.content AS post__content,\n  post.image_urls AS post__image_urls,\n  \"like\".count AS post__like_count,\n  \"comment\".count AS post__comment_count,\n  shared.count AS post__shared_count,\n  \"user\".id AS post__user__id,\n  \"user\".name AS post__user__name,\n  \"user\".nickname AS post__user__nickname,\n  \"user\".image_urls [1] AS post__user__image_url\nFROM post\n  LEFT JOIN (\n    SELECT post_id,\n      COUNT(user_id)\n    FROM post_x_user\n    GROUP BY post_id\n  ) AS \"like\" ON \"like\".post_id = post.id\n  LEFT JOIN (\n    SELECT parent_post_id,\n      COUNT(id)\n    FROM post\n    GROUP BY parent_post_id\n  ) AS \"comment\" ON \"comment\".parent_post_id = post.id\n  LEFT JOIN (\n    SELECT sharing_post_id,\n      COUNT(id)\n    FROM post\n    GROUP BY sharing_post_id\n  ) AS shared ON shared.sharing_post_id = post.id\n  LEFT JOIN \"user\" ON \"user\".id = post.user_id\nWHERE post.parent_post_id IS NULL\nLIMIT 20"};

/**
 * Query generated from SQL:
 * ```
 * SELECT post.id AS post__id,
 *   post.creation_time AS post__creation_time,
 *   post.update_time AS post__update_time,
 *   post.deletion_time AS post__deletion_time,
 *   post.content AS post__content,
 *   post.image_urls AS post__image_urls,
 *   "like".count AS post__like_count,
 *   "comment".count AS post__comment_count,
 *   shared.count AS post__shared_count,
 *   "user".id AS post__user__id,
 *   "user".name AS post__user__name,
 *   "user".nickname AS post__user__nickname,
 *   "user".image_urls [1] AS post__user__image_url
 * FROM post
 *   LEFT JOIN (
 *     SELECT post_id,
 *       COUNT(user_id)
 *     FROM post_x_user
 *     GROUP BY post_id
 *   ) AS "like" ON "like".post_id = post.id
 *   LEFT JOIN (
 *     SELECT parent_post_id,
 *       COUNT(id)
 *     FROM post
 *     GROUP BY parent_post_id
 *   ) AS "comment" ON "comment".parent_post_id = post.id
 *   LEFT JOIN (
 *     SELECT sharing_post_id,
 *       COUNT(id)
 *     FROM post
 *     GROUP BY sharing_post_id
 *   ) AS shared ON shared.sharing_post_id = post.id
 *   LEFT JOIN "user" ON "user".id = post.user_id
 * WHERE post.parent_post_id IS NULL
 * LIMIT 20
 * ```
 */
export const posts = new PreparedQuery<IPostsParams,IPostsResult>(postsIR);


