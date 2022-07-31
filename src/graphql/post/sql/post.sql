/* @name post */
SELECT parent_post.id
FROM post AS parent_post
  LEFT JOIN post ON post.parent_post_id = parent_post.id
  LEFT JOIN post AS child_post ON child_post.parent_post_id = post.id
  LEFT JOIN "user" ON "user".id = post.user_id
  LEFT JOIN post AS sharing_post ON sharing_post.id = parent_post.sharing_post_id
WHERE parent_post.id = $1;