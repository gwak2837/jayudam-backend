/* @name me */
SELECT id,
  nickname
FROM "user"
WHERE id = $1;