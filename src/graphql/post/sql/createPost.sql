/* @name createPost */
SELECT reason,
  new_post
FROM create_post($1, $2, $3, $4, $5, $6);