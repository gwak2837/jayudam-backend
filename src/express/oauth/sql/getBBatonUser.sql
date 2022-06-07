/* @name getBBatonUser */
SELECT id,
  nickname
FROM "user"
WHERE bbaton_oauth = $1;