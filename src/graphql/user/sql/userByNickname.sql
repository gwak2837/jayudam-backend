/* @name userByNickname */
SELECT bio,
  blocking_start_time,
  blocking_end_time,
  grade,
  image_urls,
  is_verified_sex,
  nickname,
  sex,
  town1_count,
  town1_name,
  town2_count,
  town2_name
FROM "user"
WHERE nickname = $1;