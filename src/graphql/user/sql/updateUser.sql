/* @name updateUser */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  bio = COALESCE(bio, $2),
  email = COALESCE(email, $3),
  image_urls = COALESCE(image_urls, $3),
  nickname = COALESCE(nickname, $3),
  oauth_naver = $4
WHERE id = $1
  AND (
    bio IS NULL
    OR email IS NULL
    OR image_urls IS NULL
    OR nickname IS NULL
  );