/* @name createPost */
INSERT INTO post (
    content,
    image_urls,
    parent_post_id,
    sharing_post_id,
    user_id
  )
VALUES ($1, $2, $3, $4, $5)
RETURNING id,
  creation_time;