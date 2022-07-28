/* @name deleteUser */
DELETE FROM "user"
WHERE id = $1;