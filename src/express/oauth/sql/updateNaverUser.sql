/* @name updateNaverUser */
UPDATE "user"
SET modification_time = CURRENT_TIMESTAMP,
  email = COALESCE(email, $2),
  image_url = COALESCE(image_url, $3),
  naver_oauth = $4
WHERE id = $1
  AND (
    email IS NULL
    OR image_url IS NULL
  );