/* @name getBBatonUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  nickname,
  sleeping_time
FROM "user"
WHERE oauth_bbaton = $1;