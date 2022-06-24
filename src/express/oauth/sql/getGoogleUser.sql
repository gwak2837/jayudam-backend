/* @name getGoogleUser */
SELECT id,
  nickname,
  name
FROM "user"
WHERE google_oauth = $1;