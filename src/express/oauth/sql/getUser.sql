/* @name getUser */
SELECT id,
  email,
  name
FROM "user"
WHERE id = $1;