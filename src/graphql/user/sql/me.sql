/* @name me */
SELECT id,
  bio,
  blocking_start_time,
  blocking_end_time,
  cherry,
  grade,
  image_urls,
  is_verified_sex,
  name,
  nickname,
  sex,
  town1_count,
  town1_name,
  town2_count,
  town2_name
FROM "user"
WHERE id = $1;