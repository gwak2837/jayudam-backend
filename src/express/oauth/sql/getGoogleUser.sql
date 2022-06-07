/* @name getGoogleUser */
SELECT id,
  nickname
FROM "user"
WHERE google_oauth = $1;