/* @name hasDuplicateSharingPost */
SELECT id
FROM post
WHERE user_id = $1
  AND parent_post_id = $2;