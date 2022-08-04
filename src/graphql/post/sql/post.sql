/* @name post */
SELECT parent_post.id AS parent_post__id,
  parent_post.creation_time AS parent_post__creation_time,
  parent_post.update_time AS parent_post__update_time,
  parent_post.deletion_time AS parent_post__deletion_time,
  parent_post.content AS parent_post__content,
  parent_post.image_urls AS parent_post__image_urls,
  (
    SELECT COUNT(user_id)
    FROM post_x_user
    WHERE post_id = $1
  ) AS parent_post__like_count,
  (
    SELECT COUNT(id)
    FROM post
    WHERE post.parent_post_id = $1
  ) AS parent_post__comment_count,
  (
    SELECT COUNT(id)
    FROM post
    WHERE post.sharing_post_id = $1
  ) AS parent_post__shared_count,
  parent_author.id AS parent_post__user__id,
  parent_author.name AS parent_post__user__name,
  parent_author.nickname AS parent_post__user__nickname,
  parent_author.image_urls [1] AS parent_post__user__image_url,
  --
  sharing_post.id AS sharing_post__id,
  sharing_post.creation_time AS sharing_post__creation_time,
  sharing_post.update_time AS sharing_post__update_time,
  sharing_post.deletion_time AS sharing_post__deletion_time,
  sharing_post.content AS sharing_post__content,
  sharing_post.image_urls AS sharing_post__image_urls,
  sharing_author.id AS sharing_post__user__id,
  sharing_author.name AS sharing_post__user__name,
  sharing_author.nickname AS sharing_post__user__nickname,
  sharing_author.image_urls [1] AS sharing_post__user__image_url,
  --
  post.id AS post__id,
  post.creation_time AS post__creation_time,
  post.update_time AS post__update_time,
  post.deletion_time AS post__deletion_time,
  post.content AS post__content,
  post.image_urls AS post__image_urls,
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
  child_like.count AS child_post__like_count,
  COUNT(grand_child_post.id) AS child_post__comment_count,
  child_shared.count AS child_post__shared_count,
  child_author.id AS child_post__user__id,
  child_author.name AS child_post__user__name,
  child_author.nickname AS child_post__user__nickname,
  child_author.image_urls [1] AS child_post__user__image_url
FROM post AS parent_post
  LEFT JOIN "user" AS parent_author ON parent_author.id = parent_post.user_id
  LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id
  LEFT JOIN "user" AS sharing_author ON sharing_author.id = sharing_post.user_id
  LEFT JOIN post ON post.parent_post_id = parent_post.id
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
  LEFT JOIN (
    SELECT post_id,
      COUNT(user_id)
    FROM post_x_user
    GROUP BY post_id
  ) AS child_like ON child_like.post_id = child_post.id
  LEFT JOIN (
    SELECT sharing_post_id,
      COUNT(id)
    FROM post
    GROUP BY sharing_post_id
  ) AS child_shared ON child_shared.sharing_post_id = child_post.id
  LEFT JOIN "user" AS child_author ON child_author.id = child_post.user_id
  LEFT JOIN post AS grand_child_post ON grand_child_post.parent_post_id = child_post.id
WHERE parent_post.id = $1
GROUP BY parent_post.id,
  parent_author.id,
  sharing_post.id,
  sharing_author.id,
  post.id,
  "like".count,
  "comment".count,
  shared.count,
  "user".id,
  child_post.id,
  child_like.count,
  child_shared.count,
  child_author.id
LIMIT 20;