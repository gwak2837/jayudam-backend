/* @name deletePost */
SELECT has_authorized,
  is_deleted,
  deletion_time
FROM delete_post ($1, $2);