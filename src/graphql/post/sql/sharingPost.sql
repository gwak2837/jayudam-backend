/* @name sharingPost */
SELECT id
FROM post
WHERE sharing_post_id = $1
  AND user_id = $2;