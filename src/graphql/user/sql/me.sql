/* @name me */
SELECT "user".id,
  "user".creation_time,
  bio,
  birthday,
  birthyear,
  blocking_start_time,
  blocking_end_time,
  cover_image_urls,
  cherry,
  grade,
  "user".image_urls,
  is_private,
  is_verified_birthday,
  is_verified_birthyear,
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
  (
    SELECT COUNT(leader_id)
    FROM user_x_user
    WHERE user_x_user.leader_id = $1
  ) AS follower_count,
  (
    SELECT COUNT(follower_id)
    FROM user_x_user
    WHERE user_x_user.follower_id = $1
  ) AS following_count
FROM "user"
  LEFT JOIN post ON post.user_id = "user".id
WHERE "user".id = $1
GROUP BY "user".id;