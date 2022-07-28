/* @name updateUser */
/* WIP: need to avoid updating with the same value */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  bio = COALESCE($2, bio),
  cert_agreement = COALESCE($3, cert_agreement),
  email = COALESCE($4, email),
  image_urls = COALESCE($5, image_urls),
  nickname = COALESCE($6, nickname),
  service_agreement = COALESCE($7, service_agreement),
  town1_name = COALESCE($8, town1_name),
  town1_count = CASE
    WHEN $8 IS NULL THEN town1_count
    ELSE 0
  END,
  town2_name = COALESCE($9, town2_name),
  town2_count = CASE
    WHEN $9 IS NULL THEN town2_count
    ELSE 0
  END
WHERE id = $1
RETURNING bio,
  cert_agreement,
  email,
  image_urls,
  nickname,
  service_agreement,
  town1_name,
  town2_name;