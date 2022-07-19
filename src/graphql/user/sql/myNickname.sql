/* @name myNickname */
SELECT id,
  nickname
FROM "user"
WHERE id = $1;