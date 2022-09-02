/* @name me */
SELECT "user".id,
  "user".creation_time,
  bio,
  blocking_start_time,
  blocking_end_time,
  cover_image_urls,
  cherry,
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
  COUNT(post.id) AS post_count,
  COUNT(follower.leader_id) AS follower_count,
  COUNT("following".follower_id) AS following_count
FROM "user"
  LEFT JOIN post ON post.user_id = "user".id
  LEFT JOIN user_x_user AS follower ON follower.leader_id = "user".id
  LEFT JOIN user_x_user AS "following" ON "following".follower_id = "user".id
WHERE "user".id = $1
GROUP BY "user".id;