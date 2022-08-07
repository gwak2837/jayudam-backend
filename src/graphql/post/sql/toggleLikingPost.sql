/* @name toggleLikingPost */
SELECT result,
  like_count
FROM toggle_liking_post($1, $2);