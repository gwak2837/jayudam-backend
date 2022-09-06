/* @name post */
SELECT post.id AS post__id,
  post.creation_time AS post__creation_time,
  post.update_time AS post__update_time,
  post.deletion_time AS post__deletion_time,
  post.content AS post__content,
  post.image_urls AS post__image_urls,
  is_liked.user_id IS NOT NULL AS post__is_liked,
  do_i_comment.id IS NOT NULL AS post__do_i_comment,
  do_i_share.id IS NOT NULL AS post__do_i_share,
  (
    SELECT COUNT(user_id)
    FROM post_x_user
    WHERE post_id = $1
  ) AS post__like_count,
  (
    SELECT COUNT(id)
    FROM post
    WHERE post.parent_post_id = $1
  ) AS post__comment_count,
  (
    SELECT COUNT(id)
    FROM post
    WHERE post.sharing_post_id = $1
  ) AS post__shared_count,
  "user".id AS post__user__id,
  "user".name AS post__user__name,
  "user".nickname AS post__user__nickname,
  "user".image_urls [1] AS post__user__image_url,
  --
  parent_user.id AS parent_post__user__id,
  parent_user.name AS parent_post__user__name,
  --
  sharing_post.id AS sharing_post__id,
  sharing_post.creation_time AS sharing_post__creation_time,
  sharing_post.update_time AS sharing_post__update_time,
  sharing_post.deletion_time AS sharing_post__deletion_time,
  sharing_post.content AS sharing_post__content,
  sharing_post.image_urls AS sharing_post__image_urls,
  sharing_user.id AS sharing_post__user__id,
  sharing_user.name AS sharing_post__user__name,
  sharing_user.nickname AS sharing_post__user__nickname,
  sharing_user.image_urls [1] AS sharing_post__user__image_url
FROM post
  LEFT JOIN post_x_user AS is_liked ON is_liked.post_id = post.id
  AND is_liked.user_id = $2
  LEFT JOIN post AS do_i_comment ON do_i_comment.id = (
    SELECT id
    FROM post AS p
    WHERE p.parent_post_id = post.id
      AND user_id = $2
    LIMIT 1
  )
  LEFT JOIN post AS do_i_share ON do_i_share.sharing_post_id = post.id
  AND do_i_share.user_id = $2
  LEFT JOIN "user" ON "user".id = post.user_id
  LEFT JOIN post AS parent_post ON parent_post.id = post.parent_post_id
  LEFT JOIN "user" AS parent_user ON parent_user.id = parent_post.user_id
  LEFT JOIN post AS sharing_post ON sharing_post.id = post.sharing_post_id
  LEFT JOIN "user" AS sharing_user ON sharing_user.id = sharing_post.user_id
WHERE post.id = $1;