/* @name getGoogleUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  legal_name,
  name,
  sleeping_time
FROM "user"
WHERE oauth_google = $1;