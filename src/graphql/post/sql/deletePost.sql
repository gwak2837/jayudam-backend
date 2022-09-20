/* @name deletePost */
SELECT has_authorized,
  is_deleted,
  deletion_time,
  image_urls
FROM delete_post ($1, $2);