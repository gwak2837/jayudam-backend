/* @name messageSender */
SELECT name,
  nickname,
  image_urls [0] AS image_url
FROM "user"
WHERE id = $1;