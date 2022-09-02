/* @name userByName */
SELECT "user".id,
  "user".creation_time,
  bio,
  blocking_start_time,
  blocking_end_time,
  grade,
  "user".image_urls,
  is_private,
  is_verified_sex,
  name,
  nickname,
  sex,
  sleeping_time,
  town1_count,
  town1_name,
  town2_count,
  town2_name,
  COUNT(post.id) AS post_count
FROM "user"
  LEFT JOIN post ON post.user_id = "user".id
WHERE name = $1
GROUP BY "user".id;