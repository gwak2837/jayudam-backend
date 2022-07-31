/* @name isUniqueUsername */
SELECT nickname
FROM "user"
WHERE nickname = $1;