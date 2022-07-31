/** Types generated for queries found in "src/graphql/post/sql/post.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'Post' parameters type */
export type IPostParams = void;

/** 'Post' return type */
export interface IPostResult {
  child_post__comment_count: string | null;
  child_post__content: string | null;
  child_post__creation_time: Date | null;
  child_post__deletion_time: Date | null;
  child_post__id: string;
  child_post__image_urls: stringArray | null;
  child_post__like_count: string | null;
  child_post__shared_count: string | null;
  child_post__update_time: Date | null;
  child_post__user__id: string;
  child_post__user__image_url: string | null;
  child_post__user__name: string | null;
  child_post__user__nickname: string | null;
  parent_post__comment_count: string | null;
  parent_post__content: string | null;
  parent_post__creation_time: Date | null;
  parent_post__delete_time: Date | null;
  parent_post__id: string;
  parent_post__image_urls: stringArray | null;
  parent_post__like_count: string | null;
  parent_post__shared_count: string | null;
  parent_post__update_time: Date | null;
  parent_post__user__id: string;
  parent_post__user__image_url: string | null;
  parent_post__user__name: string | null;
  parent_post__user__nickname: string | null;
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
  sharing_post__content: string | null;
  sharing_post__creation_time: Date | null;
  sharing_post__delete_time: Date | null;
  sharing_post__id: string;
  sharing_post__image_urls: stringArray | null;
  sharing_post__update_time: Date | null;
  sharing_post__user__id: string;
  sharing_post__user__image_url: string | null;
  sharing_post__user__name: string | null;
  sharing_post__user__nickname: string | null;
}

/** 'Post' query type */
export interface IPostQuery {
  params: IPostParams;
  result: IPostResult;
}

const postIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT parent_post.id AS parent_post__id,\n  parent_post.creation_time AS parent_post__creation_time,\n  parent_post.update_time AS parent_post__update_time,\n  parent_post.deletion_time AS parent_post__delete_time,\n  parent_post.content AS parent_post__content,\n  parent_post.image_urls AS parent_post__image_urls,\n  COUNT(parent_like.user_id) AS parent_post__like_count,\n  COUNT(post.id) AS parent_post__comment_count,\n  COUNT(parent_shared.id) AS parent_post__shared_count,\n  parent_author.id AS parent_post__user__id,\n  parent_author.name AS parent_post__user__name,\n  parent_author.nickname AS parent_post__user__nickname,\n  parent_author.image_urls [1] AS parent_post__user__image_url,\n  --\n  sharing_post.id AS sharing_post__id,\n  sharing_post.creation_time AS sharing_post__creation_time,\n  sharing_post.update_time AS sharing_post__update_time,\n  sharing_post.deletion_time AS sharing_post__delete_time,\n  sharing_post.content AS sharing_post__content,\n  sharing_post.image_urls AS sharing_post__image_urls,\n  sharing_author.id AS sharing_post__user__id,\n  sharing_author.name AS sharing_post__user__name,\n  sharing_author.nickname AS sharing_post__user__nickname,\n  sharing_author.image_urls [1] AS sharing_post__user__image_url,\n  --\n  post.id AS post__id,\n  post.creation_time AS post__creation_time,\n  post.update_time AS post__update_time,\n  post.deletion_time AS post__deletion_time,\n  post.content AS post__content,\n  post.image_urls AS post__image_urls,\n  COUNT(\"like\".user_id) AS post__like_count,\n  COUNT(child_post.id) AS post__comment_count,\n  COUNT(shared.id) AS post__shared_count,\n  \"user\".id AS post__user__id,\n  \"user\".name AS post__user__name,\n  \"user\".nickname AS post__user__nickname,\n  \"user\".image_urls [1] AS post__user__image_url,\n  --\n  child_post.id AS child_post__id,\n  child_post.creation_time AS child_post__creation_time,\n  child_post.update_time AS child_post__update_time,\n  child_post.deletion_time AS child_post__deletion_time,\n  child_post.content AS child_post__content,\n  child_post.image_urls AS child_post__image_urls,\n  COUNT(child_like.user_id) AS child_post__like_count,\n  COUNT(grand_child_post.id) AS child_post__comment_count,\n  COUNT(child_shared.id) AS child_post__shared_count,\n  child_author.id AS child_post__user__id,\n  child_author.name AS child_post__user__name,\n  child_author.nickname AS child_post__user__nickname,\n  child_author.image_urls [1] AS child_post__user__image_url\nFROM post AS parent_post\n  LEFT JOIN post_x_user AS parent_like ON parent_like.post_id = parent_post.id\n  LEFT JOIN post AS parent_shared ON parent_shared.sharing_post_id = parent_post.id\n  LEFT JOIN \"user\" AS parent_author ON parent_author.id = parent_post.user_id\n  LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id\n  LEFT JOIN \"user\" AS sharing_author ON sharing_author.id = sharing_post.user_id\n  LEFT JOIN post ON post.parent_post_id = parent_post.id\n  LEFT JOIN post_x_user AS \"like\" ON \"like\".post_id = post.id\n  LEFT JOIN post AS shared ON shared.sharing_post_id = post.id\n  LEFT JOIN \"user\" ON \"user\".id = post.user_id\n  LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id\n  LEFT JOIN post_x_user AS child_like ON child_like.post_id = child_post.id\n  LEFT JOIN post AS grand_child_post ON grand_child_post.parent_post_id = child_post.id\n  LEFT JOIN post AS child_shared ON child_shared.sharing_post_id = child_post.id\n  LEFT JOIN \"user\" AS child_author ON child_author.id = child_post.user_id\nWHERE parent_post.id = $1\nGROUP BY parent_post.id,\n  parent_author.id,\n  sharing_post.id,\n  sharing_author.id,\n  post.id,\n  \"user\".id,\n  child_post.id,\n  child_author.id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT parent_post.id AS parent_post__id,
 *   parent_post.creation_time AS parent_post__creation_time,
 *   parent_post.update_time AS parent_post__update_time,
 *   parent_post.deletion_time AS parent_post__delete_time,
 *   parent_post.content AS parent_post__content,
 *   parent_post.image_urls AS parent_post__image_urls,
 *   COUNT(parent_like.user_id) AS parent_post__like_count,
 *   COUNT(post.id) AS parent_post__comment_count,
 *   COUNT(parent_shared.id) AS parent_post__shared_count,
 *   parent_author.id AS parent_post__user__id,
 *   parent_author.name AS parent_post__user__name,
 *   parent_author.nickname AS parent_post__user__nickname,
 *   parent_author.image_urls [1] AS parent_post__user__image_url,
 *   --
 *   sharing_post.id AS sharing_post__id,
 *   sharing_post.creation_time AS sharing_post__creation_time,
 *   sharing_post.update_time AS sharing_post__update_time,
 *   sharing_post.deletion_time AS sharing_post__delete_time,
 *   sharing_post.content AS sharing_post__content,
 *   sharing_post.image_urls AS sharing_post__image_urls,
 *   sharing_author.id AS sharing_post__user__id,
 *   sharing_author.name AS sharing_post__user__name,
 *   sharing_author.nickname AS sharing_post__user__nickname,
 *   sharing_author.image_urls [1] AS sharing_post__user__image_url,
 *   --
 *   post.id AS post__id,
 *   post.creation_time AS post__creation_time,
 *   post.update_time AS post__update_time,
 *   post.deletion_time AS post__deletion_time,
 *   post.content AS post__content,
 *   post.image_urls AS post__image_urls,
 *   COUNT("like".user_id) AS post__like_count,
 *   COUNT(child_post.id) AS post__comment_count,
 *   COUNT(shared.id) AS post__shared_count,
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
 *   COUNT(child_like.user_id) AS child_post__like_count,
 *   COUNT(grand_child_post.id) AS child_post__comment_count,
 *   COUNT(child_shared.id) AS child_post__shared_count,
 *   child_author.id AS child_post__user__id,
 *   child_author.name AS child_post__user__name,
 *   child_author.nickname AS child_post__user__nickname,
 *   child_author.image_urls [1] AS child_post__user__image_url
 * FROM post AS parent_post
 *   LEFT JOIN post_x_user AS parent_like ON parent_like.post_id = parent_post.id
 *   LEFT JOIN post AS parent_shared ON parent_shared.sharing_post_id = parent_post.id
 *   LEFT JOIN "user" AS parent_author ON parent_author.id = parent_post.user_id
 *   LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id
 *   LEFT JOIN "user" AS sharing_author ON sharing_author.id = sharing_post.user_id
 *   LEFT JOIN post ON post.parent_post_id = parent_post.id
 *   LEFT JOIN post_x_user AS "like" ON "like".post_id = post.id
 *   LEFT JOIN post AS shared ON shared.sharing_post_id = post.id
 *   LEFT JOIN "user" ON "user".id = post.user_id
 *   LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id
 *   LEFT JOIN post_x_user AS child_like ON child_like.post_id = child_post.id
 *   LEFT JOIN post AS grand_child_post ON grand_child_post.parent_post_id = child_post.id
 *   LEFT JOIN post AS child_shared ON child_shared.sharing_post_id = child_post.id
 *   LEFT JOIN "user" AS child_author ON child_author.id = child_post.user_id
 * WHERE parent_post.id = $1
 * GROUP BY parent_post.id,
 *   parent_author.id,
 *   sharing_post.id,
 *   sharing_author.id,
 *   post.id,
 *   "user".id,
 *   child_post.id,
 *   child_author.id
 * ```
 */
export const post = new PreparedQuery<IPostParams,IPostResult>(postIR);


