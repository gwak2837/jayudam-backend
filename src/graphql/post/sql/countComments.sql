/* @name countComments */
SELECT COUNT(id)
FROM post
WHERE parent_post_id = $1;