/* @name isUniqueNickname */
SELECT nickname
FROM "user"
WHERE nickname = $1;