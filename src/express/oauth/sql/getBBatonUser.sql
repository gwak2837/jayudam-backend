/* @name getBBatonUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  name,
  sex,
  sleeping_time
FROM "user"
WHERE oauth_bbaton = $1;