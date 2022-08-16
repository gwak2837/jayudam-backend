/* @name hasDuplicateSharingPost */
SELECT id
FROM post
WHERE user_id = $1
  AND sharing_post_id = $2;