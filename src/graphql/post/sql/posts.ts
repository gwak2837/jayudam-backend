/** Types generated for queries found in "src/graphql/post/sql/posts.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'Posts' parameters type */
export type IPostsParams = void;

/** 'Posts' return type */
export interface IPostsResult {
  parent_post__id: string;
  parent_post__user__id: string;
  parent_post__user__name: string | null;
  post__comment_count: string | null;
  post__content: string | null;
  post__creation_time: Date | null;
  post__deletion_time: Date | null;
  post__do_i_comment: boolean | null;
  post__do_i_share: boolean | null;
  post__id: string;
  post__image_urls: stringArray | null;
  post__is_liked: boolean | null;
  post__like_count: string | null;
  post__shared_count: string | null;
  post__update_time: Date | null;
  post__user__id: string;
  post__user__image_url: string | null;
  post__user__name: string | null;
  post__user__nickname: string | null;
  sharing_post__content: string | null;
  sharing_post__creation_time: Date | null;
  sharing_post__deletion_time: Date | null;
  sharing_post__id: string;
  sharing_post__image_urls: stringArray | null;
  sharing_post__update_time: Date | null;
  sharing_post__user__id: string;
  sharing_post__user__image_url: string | null;
  sharing_post__user__name: string | null;
  sharing_post__user__nickname: string | null;
}

/** 'Posts' query type */
export interface IPostsQuery {
  params: IPostsParams;
  result: IPostsResult;
}

const postsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT post.id AS post__id,\n  post.creation_time AS post__creation_time,\n  post.update_time AS post__update_time,\n  post.deletion_time AS post__deletion_time,\n  post.content AS post__content,\n  post.image_urls AS post__image_urls,\n  is_liked.user_id IS NOT NULL AS post__is_liked,\n  do_i_comment.id IS NOT NULL AS post__do_i_comment,\n  do_i_share.id IS NOT NULL AS post__do_i_share,\n  \"like\".count AS post__like_count,\n  \"comment\".count AS post__comment_count,\n  shared.count AS post__shared_count,\n  \"user\".id AS post__user__id,\n  \"user\".name AS post__user__name,\n  \"user\".nickname AS post__user__nickname,\n  \"user\".image_urls [1] AS post__user__image_url,\n  --\n  parent_post.id AS parent_post__id,\n  parent_user.id AS parent_post__user__id,\n  parent_user.name AS parent_post__user__name,\n  --\n  sharing_post.id AS sharing_post__id,\n  sharing_post.creation_time AS sharing_post__creation_time,\n  sharing_post.update_time AS sharing_post__update_time,\n  sharing_post.deletion_time AS sharing_post__deletion_time,\n  sharing_post.content AS sharing_post__content,\n  sharing_post.image_urls AS sharing_post__image_urls,\n  sharing_user.id AS sharing_post__user__id,\n  sharing_user.name AS sharing_post__user__name,\n  sharing_user.nickname AS sharing_post__user__nickname,\n  sharing_user.image_urls [1] AS sharing_post__user__image_url\nFROM post\n  LEFT JOIN post_x_user AS is_liked ON is_liked.post_id = post.id\n  AND is_liked.user_id = $1\n  LEFT JOIN post AS do_i_comment ON do_i_comment.id = (\n    SELECT id\n    FROM post AS p\n    WHERE p.parent_post_id = post.id\n      AND user_id = $1\n    LIMIT 1\n  )\n  LEFT JOIN post AS do_i_share ON do_i_share.sharing_post_id = post.id\n  AND do_i_share.user_id = $1\n  LEFT JOIN (\n    SELECT post_id,\n      COUNT(user_id)\n    FROM post_x_user\n    GROUP BY post_id\n  ) AS \"like\" ON \"like\".post_id = post.id\n  LEFT JOIN (\n    SELECT parent_post_id,\n      COUNT(id)\n    FROM post\n    GROUP BY parent_post_id\n  ) AS \"comment\" ON \"comment\".parent_post_id = post.id\n  LEFT JOIN (\n    SELECT sharing_post_id,\n      COUNT(id)\n    FROM post\n    GROUP BY sharing_post_id\n  ) AS shared ON shared.sharing_post_id = post.id\n  LEFT JOIN \"user\" ON \"user\".id = post.user_id\n  LEFT JOIN post AS parent_post ON parent_post.id = post.parent_post_id\n  LEFT JOIN \"user\" AS parent_user ON parent_user.id = parent_post.user_id\n  LEFT JOIN post AS sharing_post ON sharing_post.id = post.sharing_post_id\n  LEFT JOIN \"user\" AS sharing_user ON sharing_user.id = sharing_post.user_id\nWHERE post.deletion_time IS NULL\n  AND post.id < $2\nORDER BY post.id DESC\nLIMIT $3"};

/**
 * Query generated from SQL:
 * ```
 * SELECT post.id AS post__id,
 *   post.creation_time AS post__creation_time,
 *   post.update_time AS post__update_time,
 *   post.deletion_time AS post__deletion_time,
 *   post.content AS post__content,
 *   post.image_urls AS post__image_urls,
 *   is_liked.user_id IS NOT NULL AS post__is_liked,
 *   do_i_comment.id IS NOT NULL AS post__do_i_comment,
 *   do_i_share.id IS NOT NULL AS post__do_i_share,
 *   "like".count AS post__like_count,
 *   "comment".count AS post__comment_count,
 *   shared.count AS post__shared_count,
 *   "user".id AS post__user__id,
 *   "user".name AS post__user__name,
 *   "user".nickname AS post__user__nickname,
 *   "user".image_urls [1] AS post__user__image_url,
 *   --
 *   parent_post.id AS parent_post__id,
 *   parent_user.id AS parent_post__user__id,
 *   parent_user.name AS parent_post__user__name,
 *   --
 *   sharing_post.id AS sharing_post__id,
 *   sharing_post.creation_time AS sharing_post__creation_time,
 *   sharing_post.update_time AS sharing_post__update_time,
 *   sharing_post.deletion_time AS sharing_post__deletion_time,
 *   sharing_post.content AS sharing_post__content,
 *   sharing_post.image_urls AS sharing_post__image_urls,
 *   sharing_user.id AS sharing_post__user__id,
 *   sharing_user.name AS sharing_post__user__name,
 *   sharing_user.nickname AS sharing_post__user__nickname,
 *   sharing_user.image_urls [1] AS sharing_post__user__image_url
 * FROM post
 *   LEFT JOIN post_x_user AS is_liked ON is_liked.post_id = post.id
 *   AND is_liked.user_id = $1
 *   LEFT JOIN post AS do_i_comment ON do_i_comment.id = (
 *     SELECT id
 *     FROM post AS p
 *     WHERE p.parent_post_id = post.id
 *       AND user_id = $1
 *     LIMIT 1
 *   )
 *   LEFT JOIN post AS do_i_share ON do_i_share.sharing_post_id = post.id
 *   AND do_i_share.user_id = $1
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
 *   LEFT JOIN post AS parent_post ON parent_post.id = post.parent_post_id
 *   LEFT JOIN "user" AS parent_user ON parent_user.id = parent_post.user_id
 *   LEFT JOIN post AS sharing_post ON sharing_post.id = post.sharing_post_id
 *   LEFT JOIN "user" AS sharing_user ON sharing_user.id = sharing_post.user_id
 * WHERE post.deletion_time IS NULL
 *   AND post.id < $2
 * ORDER BY post.id DESC
 * LIMIT $3
 * ```
 */
export const posts = new PreparedQuery<IPostsParams,IPostsResult>(postsIR);


