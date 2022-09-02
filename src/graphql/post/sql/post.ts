/** Types generated for queries found in "src/graphql/post/sql/post.sql" */
import { PreparedQuery } from '@pgtyped/query'

export type stringArray = string[]

/** 'Post' parameters type */
export type IPostParams = void

/** 'Post' return type */
export interface IPostResult {
  child_post__comment_count: string | null
  child_post__content: string | null
  child_post__creation_time: Date | null
  child_post__deletion_time: Date | null
  child_post__do_i_comment: boolean | null
  child_post__do_i_share: boolean | null
  child_post__id: string
  child_post__image_urls: stringArray | null
  child_post__is_liked: boolean | null
  child_post__like_count: string | null
  child_post__shared_count: string | null
  child_post__update_time: Date | null
  child_post__user__id: string
  child_post__user__image_url: string | null
  child_post__user__name: string | null
  child_post__user__nickname: string | null
  parent_post__comment_count: string | null
  parent_post__content: string | null
  parent_post__creation_time: Date | null
  parent_post__deletion_time: Date | null
  parent_post__do_i_comment: boolean | null
  parent_post__do_i_share: boolean | null
  parent_post__grandparent_user__id: string
  parent_post__grandparent_user__name: string | null
  parent_post__id: string
  parent_post__image_urls: stringArray | null
  parent_post__is_liked: boolean | null
  parent_post__like_count: string | null
  parent_post__shared_count: string | null
  parent_post__update_time: Date | null
  parent_post__user__id: string
  parent_post__user__image_url: string | null
  parent_post__user__name: string | null
  parent_post__user__nickname: string | null
  post__comment_count: string | null
  post__content: string | null
  post__creation_time: Date | null
  post__deletion_time: Date | null
  post__do_i_comment: boolean | null
  post__do_i_share: boolean | null
  post__id: string
  post__image_urls: stringArray | null
  post__is_liked: boolean | null
  post__like_count: string | null
  post__shared_count: string | null
  post__update_time: Date | null
  post__user__id: string
  post__user__image_url: string | null
  post__user__name: string | null
  post__user__nickname: string | null
  sharing_post__content: string | null
  sharing_post__creation_time: Date | null
  sharing_post__deletion_time: Date | null
  sharing_post__id: string
  sharing_post__image_urls: stringArray | null
  sharing_post__update_time: Date | null
  sharing_post__user__id: string
  sharing_post__user__image_url: string | null
  sharing_post__user__name: string | null
  sharing_post__user__nickname: string | null
}

/** 'Post' query type */
export interface IPostQuery {
  params: IPostParams
  result: IPostResult
}

const postIR: any = {
  usedParamSet: {},
  params: [],
  statement:
    'SELECT parent_post.id AS parent_post__id,\n  parent_post.creation_time AS parent_post__creation_time,\n  parent_post.update_time AS parent_post__update_time,\n  parent_post.deletion_time AS parent_post__deletion_time,\n  parent_post.content AS parent_post__content,\n  parent_post.image_urls AS parent_post__image_urls,\n  parent_is_liked.user_id IS NOT NULL AS parent_post__is_liked,\n  parent_do_i_comment.id IS NOT NULL AS parent_post__do_i_comment,\n  parent_do_i_share.id IS NOT NULL AS parent_post__do_i_share,\n  (\n    SELECT COUNT(user_id)\n    FROM post_x_user\n    WHERE post_id = $1\n  ) AS parent_post__like_count,\n  (\n    SELECT COUNT(id)\n    FROM post\n    WHERE post.parent_post_id = $1\n  ) AS parent_post__comment_count,\n  (\n    SELECT COUNT(id)\n    FROM post\n    WHERE post.sharing_post_id = $1\n  ) AS parent_post__shared_count,\n  parent_user.id AS parent_post__user__id,\n  parent_user.name AS parent_post__user__name,\n  parent_user.nickname AS parent_post__user__nickname,\n  parent_user.image_urls [1] AS parent_post__user__image_url,\n  grandparent_user.id AS parent_post__grandparent_user__id,\n  grandparent_user.name AS parent_post__grandparent_user__name,\n  --\n  sharing_post.id AS sharing_post__id,\n  sharing_post.creation_time AS sharing_post__creation_time,\n  sharing_post.update_time AS sharing_post__update_time,\n  sharing_post.deletion_time AS sharing_post__deletion_time,\n  sharing_post.content AS sharing_post__content,\n  sharing_post.image_urls AS sharing_post__image_urls,\n  sharing_user.id AS sharing_post__user__id,\n  sharing_user.name AS sharing_post__user__name,\n  sharing_user.nickname AS sharing_post__user__nickname,\n  sharing_user.image_urls [1] AS sharing_post__user__image_url,\n  --\n  post.id AS post__id,\n  post.creation_time AS post__creation_time,\n  post.update_time AS post__update_time,\n  post.deletion_time AS post__deletion_time,\n  post.content AS post__content,\n  post.image_urls AS post__image_urls,\n  is_liked.user_id IS NOT NULL AS post__is_liked,\n  do_i_comment.id IS NOT NULL AS post__do_i_comment,\n  do_i_share.id IS NOT NULL AS post__do_i_share,\n  "like".count AS post__like_count,\n  "comment".count AS post__comment_count,\n  shared.count AS post__shared_count,\n  "user".id AS post__user__id,\n  "user".name AS post__user__name,\n  "user".nickname AS post__user__nickname,\n  "user".image_urls [1] AS post__user__image_url,\n  --\n  child_post.id AS child_post__id,\n  child_post.creation_time AS child_post__creation_time,\n  child_post.update_time AS child_post__update_time,\n  child_post.deletion_time AS child_post__deletion_time,\n  child_post.content AS child_post__content,\n  child_post.image_urls AS child_post__image_urls,\n  child_is_liked.user_id IS NOT NULL AS child_post__is_liked,\n  child_like.count AS child_post__like_count,\n  child_do_i_comment.id IS NOT NULL AS child_post__do_i_comment,\n  child_do_i_share.id IS NOT NULL AS child_post__do_i_share,\n  COUNT(grandchild_post.id) AS child_post__comment_count,\n  child_shared.count AS child_post__shared_count,\n  child_user.id AS child_post__user__id,\n  child_user.name AS child_post__user__name,\n  child_user.nickname AS child_post__user__nickname,\n  child_user.image_urls [1] AS child_post__user__image_url\nFROM post AS parent_post\n  LEFT JOIN post_x_user AS parent_is_liked ON parent_is_liked.post_id = parent_post.id\n  AND parent_is_liked.user_id = $2\n  LEFT JOIN post AS parent_do_i_comment ON parent_do_i_comment.id = (\n    SELECT id\n    FROM post\n    WHERE post.parent_post_id = parent_post.id\n      AND user_id = $2\n    LIMIT 1\n  )\n  LEFT JOIN post AS parent_do_i_share ON parent_do_i_share.sharing_post_id = parent_post.id\n  AND parent_do_i_share.user_id = $2\n  LEFT JOIN "user" AS parent_user ON parent_user.id = parent_post.user_id\n  LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id\n  LEFT JOIN "user" AS sharing_user ON sharing_user.id = sharing_post.user_id\n  LEFT JOIN post AS grandparent_post ON grandparent_post.id = parent_post.parent_post_id\n  LEFT JOIN "user" AS grandparent_user ON grandparent_user.id = grandparent_post.user_id\n  LEFT JOIN post ON post.parent_post_id = parent_post.id\n  LEFT JOIN post_x_user AS is_liked ON is_liked.post_id = post.id\n  AND is_liked.user_id = $2\n  LEFT JOIN post AS do_i_comment ON do_i_comment.id = (\n    SELECT id\n    FROM post AS p\n    WHERE p.parent_post_id = post.id\n      AND user_id = $2\n    LIMIT 1\n  )\n  LEFT JOIN post AS do_i_share ON do_i_share.sharing_post_id = post.id\n  AND do_i_share.user_id = $2\n  LEFT JOIN (\n    SELECT post_id,\n      COUNT(user_id)\n    FROM post_x_user\n    GROUP BY post_id\n  ) AS "like" ON "like".post_id = post.id\n  LEFT JOIN (\n    SELECT parent_post_id,\n      COUNT(id)\n    FROM post\n    GROUP BY parent_post_id\n  ) AS "comment" ON "comment".parent_post_id = post.id\n  LEFT JOIN (\n    SELECT sharing_post_id,\n      COUNT(id)\n    FROM post\n    GROUP BY sharing_post_id\n  ) AS shared ON shared.sharing_post_id = post.id\n  LEFT JOIN "user" ON "user".id = post.user_id\n  LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id\n  LEFT JOIN post_x_user AS child_is_liked ON child_is_liked.post_id = child_post.id\n  AND child_is_liked.user_id = $2\n  LEFT JOIN post AS child_do_i_comment ON child_do_i_comment.id = (\n    SELECT id\n    FROM post\n    WHERE post.parent_post_id = child_post.id\n      AND user_id = $2\n    LIMIT 1\n  )\n  LEFT JOIN post AS child_do_i_share ON child_do_i_share.sharing_post_id = child_post.id\n  AND child_do_i_share.user_id = $2\n  LEFT JOIN (\n    SELECT post_id,\n      COUNT(user_id)\n    FROM post_x_user\n    GROUP BY post_id\n  ) AS child_like ON child_like.post_id = child_post.id\n  LEFT JOIN (\n    SELECT sharing_post_id,\n      COUNT(id)\n    FROM post\n    GROUP BY sharing_post_id\n  ) AS child_shared ON child_shared.sharing_post_id = child_post.id\n  LEFT JOIN "user" AS child_user ON child_user.id = child_post.user_id\n  LEFT JOIN post AS grandchild_post ON grandchild_post.parent_post_id = child_post.id\nWHERE parent_post.id = $1\nGROUP BY parent_post.id,\n  parent_is_liked.user_id,\n  parent_do_i_comment.id,\n  parent_do_i_share.id,\n  parent_user.id,\n  sharing_post.id,\n  sharing_user.id,\n  grandparent_user.id,\n  --\n  post.id,\n  is_liked.user_id,\n  do_i_comment.id,\n  do_i_share.id,\n  "like".count,\n  "comment".count,\n  shared.count,\n  "user".id,\n  --\n  child_post.id,\n  child_is_liked.user_id,\n  child_do_i_comment.id,\n  child_do_i_share.id,\n  child_like.count,\n  child_shared.count,\n  child_user.id\nLIMIT 20',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT parent_post.id AS parent_post__id,
 *   parent_post.creation_time AS parent_post__creation_time,
 *   parent_post.update_time AS parent_post__update_time,
 *   parent_post.deletion_time AS parent_post__deletion_time,
 *   parent_post.content AS parent_post__content,
 *   parent_post.image_urls AS parent_post__image_urls,
 *   parent_is_liked.user_id IS NOT NULL AS parent_post__is_liked,
 *   parent_do_i_comment.id IS NOT NULL AS parent_post__do_i_comment,
 *   parent_do_i_share.id IS NOT NULL AS parent_post__do_i_share,
 *   (
 *     SELECT COUNT(user_id)
 *     FROM post_x_user
 *     WHERE post_id = $1
 *   ) AS parent_post__like_count,
 *   (
 *     SELECT COUNT(id)
 *     FROM post
 *     WHERE post.parent_post_id = $1
 *   ) AS parent_post__comment_count,
 *   (
 *     SELECT COUNT(id)
 *     FROM post
 *     WHERE post.sharing_post_id = $1
 *   ) AS parent_post__shared_count,
 *   parent_user.id AS parent_post__user__id,
 *   parent_user.name AS parent_post__user__name,
 *   parent_user.nickname AS parent_post__user__nickname,
 *   parent_user.image_urls [1] AS parent_post__user__image_url,
 *   grandparent_user.id AS parent_post__grandparent_user__id,
 *   grandparent_user.name AS parent_post__grandparent_user__name,
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
 *   sharing_user.image_urls [1] AS sharing_post__user__image_url,
 *   --
 *   post.id AS post__id,
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
 *   child_post.id AS child_post__id,
 *   child_post.creation_time AS child_post__creation_time,
 *   child_post.update_time AS child_post__update_time,
 *   child_post.deletion_time AS child_post__deletion_time,
 *   child_post.content AS child_post__content,
 *   child_post.image_urls AS child_post__image_urls,
 *   child_is_liked.user_id IS NOT NULL AS child_post__is_liked,
 *   child_like.count AS child_post__like_count,
 *   child_do_i_comment.id IS NOT NULL AS child_post__do_i_comment,
 *   child_do_i_share.id IS NOT NULL AS child_post__do_i_share,
 *   COUNT(grandchild_post.id) AS child_post__comment_count,
 *   child_shared.count AS child_post__shared_count,
 *   child_user.id AS child_post__user__id,
 *   child_user.name AS child_post__user__name,
 *   child_user.nickname AS child_post__user__nickname,
 *   child_user.image_urls [1] AS child_post__user__image_url
 * FROM post AS parent_post
 *   LEFT JOIN post_x_user AS parent_is_liked ON parent_is_liked.post_id = parent_post.id
 *   AND parent_is_liked.user_id = $2
 *   LEFT JOIN post AS parent_do_i_comment ON parent_do_i_comment.id = (
 *     SELECT id
 *     FROM post
 *     WHERE post.parent_post_id = parent_post.id
 *       AND user_id = $2
 *     LIMIT 1
 *   )
 *   LEFT JOIN post AS parent_do_i_share ON parent_do_i_share.sharing_post_id = parent_post.id
 *   AND parent_do_i_share.user_id = $2
 *   LEFT JOIN "user" AS parent_user ON parent_user.id = parent_post.user_id
 *   LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id
 *   LEFT JOIN "user" AS sharing_user ON sharing_user.id = sharing_post.user_id
 *   LEFT JOIN post AS grandparent_post ON grandparent_post.id = parent_post.parent_post_id
 *   LEFT JOIN "user" AS grandparent_user ON grandparent_user.id = grandparent_post.user_id
 *   LEFT JOIN post ON post.parent_post_id = parent_post.id
 *   LEFT JOIN post_x_user AS is_liked ON is_liked.post_id = post.id
 *   AND is_liked.user_id = $2
 *   LEFT JOIN post AS do_i_comment ON do_i_comment.id = (
 *     SELECT id
 *     FROM post AS p
 *     WHERE p.parent_post_id = post.id
 *       AND user_id = $2
 *     LIMIT 1
 *   )
 *   LEFT JOIN post AS do_i_share ON do_i_share.sharing_post_id = post.id
 *   AND do_i_share.user_id = $2
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
 *   LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id
 *   LEFT JOIN post_x_user AS child_is_liked ON child_is_liked.post_id = child_post.id
 *   AND child_is_liked.user_id = $2
 *   LEFT JOIN post AS child_do_i_comment ON child_do_i_comment.id = (
 *     SELECT id
 *     FROM post
 *     WHERE post.parent_post_id = child_post.id
 *       AND user_id = $2
 *     LIMIT 1
 *   )
 *   LEFT JOIN post AS child_do_i_share ON child_do_i_share.sharing_post_id = child_post.id
 *   AND child_do_i_share.user_id = $2
 *   LEFT JOIN (
 *     SELECT post_id,
 *       COUNT(user_id)
 *     FROM post_x_user
 *     GROUP BY post_id
 *   ) AS child_like ON child_like.post_id = child_post.id
 *   LEFT JOIN (
 *     SELECT sharing_post_id,
 *       COUNT(id)
 *     FROM post
 *     GROUP BY sharing_post_id
 *   ) AS child_shared ON child_shared.sharing_post_id = child_post.id
 *   LEFT JOIN "user" AS child_user ON child_user.id = child_post.user_id
 *   LEFT JOIN post AS grandchild_post ON grandchild_post.parent_post_id = child_post.id
 * WHERE parent_post.id = $1
 * GROUP BY parent_post.id,
 *   parent_is_liked.user_id,
 *   parent_do_i_comment.id,
 *   parent_do_i_share.id,
 *   parent_user.id,
 *   sharing_post.id,
 *   sharing_user.id,
 *   grandparent_user.id,
 *   --
 *   post.id,
 *   is_liked.user_id,
 *   do_i_comment.id,
 *   do_i_share.id,
 *   "like".count,
 *   "comment".count,
 *   shared.count,
 *   "user".id,
 *   --
 *   child_post.id,
 *   child_is_liked.user_id,
 *   child_do_i_comment.id,
 *   child_do_i_share.id,
 *   child_like.count,
 *   child_shared.count,
 *   child_user.id
 * LIMIT 20
 * ```
 */
export const post = new PreparedQuery<IPostParams, IPostResult>(postIR)
