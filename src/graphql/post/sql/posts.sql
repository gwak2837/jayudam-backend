/* @name posts */
SELECT post.id AS post__id,
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
  "user".image_urls [1] AS post__user__image_url
FROM post
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
WHERE post.parent_post_id IS NULL
LIMIT 20;