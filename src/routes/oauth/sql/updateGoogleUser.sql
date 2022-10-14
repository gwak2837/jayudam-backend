/* @name updateGoogleUser */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  email = COALESCE(email, $2),
  image_urls = COALESCE(image_urls, $3),
  oauth_google = $4
WHERE id = $1
  AND (
    email IS NULL
    OR image_urls IS NULL
  );