/* @name useCherry */
UPDATE "user"
SET cherry = cherry - 1
WHERE id = $1;