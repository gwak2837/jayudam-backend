/* @name getGoogleUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  nickname,
  name,
  sleeping_time
FROM "user"
WHERE oauth_google = $1;