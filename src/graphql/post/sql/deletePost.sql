/* @name deletePost */
UPDATE post
SET deletion_time = CURRENT_TIMESTAMP,
  content = NULL,
  image_urls = NULL,
  parent_post_id = NULL,
  sharing_post_id = NULL
WHERE id = $1
  AND user_id = $2
RETURNING id,
  creation_time,
  update_time,
  deletion_time;