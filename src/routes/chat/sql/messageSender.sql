/* @name messageSender */
SELECT
  name,
  nickname,
  image_urls[1] AS image_url
FROM
  "user"
WHERE
  id = $1;

