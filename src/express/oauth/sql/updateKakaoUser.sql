/* @name updateKakaoUser */
UPDATE "user"
SET modification_time = CURRENT_TIMESTAMP,
  email = COALESCE(email, $2),
  image_urls = COALESCE(image_urls, $3),
  kakao_oauth = $4
WHERE id = $1
  AND (
    email IS NULL
    OR image_urls IS NULL
  );