/* @name countSharingPosts */
SELECT COUNT(id)
FROM post
WHERE sharing_post_id = $1;