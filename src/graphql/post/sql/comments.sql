/* @name comments */
SELECT post.id AS post__id,
  post.creation_time AS post__creation_time,
  post.update_time AS post__update_time,
  post.deletion_time AS post__deletion_time,
  post.content AS post__content,
  post.image_urls AS post__image_urls,
  is_liked.user_id IS NOT NULL AS post__is_liked,
  do_i_comment.id IS NOT NULL AS post__do_i_comment,
  do_i_share.id IS NOT NULL AS post__do_i_share,
  "like".count AS post__like_count,
  "comment".count AS post__comment_count,
  shared.count AS post__shared_count,
  "user".id AS post__user__id,
  "user".name AS post__user__name,
  "user".nickname AS post__user__nickname,
  "user".image_urls [1] AS post__user__image_url,
  --
  child_post.id AS child_post__id,
  child_post.creation_time AS child_post__creation_time,
  child_post.update_time AS child_post__update_time,
  child_post.deletion_time AS child_post__deletion_time,
  child_post.content AS child_post__content,
  child_post.image_urls AS child_post__image_urls,
  child_is_liked.user_id IS NOT NULL AS child_post__is_liked,
  child_do_i_comment.id IS NOT NULL AS child_post__do_i_comment,
  child_do_i_share.id IS NOT NULL AS child_post__do_i_share,
  child_like.count AS child_post__like_count,
  child_comment.count AS child_post__comment_count,
  child_shared.count AS child_post__shared_count,
  child_user.id AS child_post__user__id,
  child_user.name AS child_post__user__name,
  child_user.nickname AS child_post__user__nickname,
  child_user.image_urls [1] AS child_post__user__image_url
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
  LEFT JOIN (
    SELECT post_id,
      COUNT(user_id)
    FROM post_x_user
    GROUP BY post_id
  ) AS "like" ON "like".post_id = post.id
  LEFT JOIN (
    SELECT parent_post_id,
      COUNT(id)
    FROM post
    GROUP BY parent_post_id
  ) AS "comment" ON "comment".parent_post_id = post.id
  LEFT JOIN (
    SELECT sharing_post_id,
      COUNT(id)
    FROM post
    GROUP BY sharing_post_id
  ) AS shared ON shared.sharing_post_id = post.id
  LEFT JOIN "user" ON "user".id = post.user_id
  LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id
  LEFT JOIN post_x_user AS child_is_liked ON child_is_liked.post_id = child_post.id
  AND child_is_liked.user_id = $2
  LEFT JOIN post AS child_do_i_comment ON child_do_i_comment.id = (
    SELECT id
    FROM post
    WHERE post.parent_post_id = child_post.id
      AND user_id = $2
    LIMIT 1
  )
  LEFT JOIN post AS child_do_i_share ON child_do_i_share.sharing_post_id = child_post.id
  AND child_do_i_share.user_id = $2
  LEFT JOIN (
    SELECT post_id,
      COUNT(user_id)
    FROM post_x_user
    GROUP BY post_id
  ) AS child_like ON child_like.post_id = child_post.id
  LEFT JOIN (
    SELECT parent_post_id,
      COUNT(id)
    FROM post
    GROUP BY parent_post_id
  ) AS child_comment ON child_comment.parent_post_id = child_post.id
  LEFT JOIN (
    SELECT sharing_post_id,
      COUNT(id)
    FROM post
    GROUP BY sharing_post_id
  ) AS child_shared ON child_shared.sharing_post_id = child_post.id
  LEFT JOIN "user" AS child_user ON child_user.id = child_post.user_id
WHERE post.parent_post_id = $1
  AND post.deletion_time IS NULL
  AND child_post.deletion_time IS NULL
  AND post.id > $3
ORDER BY post.id,
  child_post.id
LIMIT $4;