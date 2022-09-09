/* @name myProfile */
SELECT id,
  image_urls [1]
FROM "user"
WHERE "user".id = $1;