/* @name updateUser */
/* WIP: need to avoid updating with the same value */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  bio = COALESCE($2, bio),
  cert_agreement = COALESCE($3, cert_agreement),
  email = COALESCE($4, email),
  image_urls = COALESCE($5, image_urls),
  name = COALESCE($6, name),
  nickname = COALESCE($7, nickname),
  service_agreement = COALESCE($8, service_agreement),
  town1_name = COALESCE($9, town1_name),
  town1_count = CASE
    WHEN $9 IS NULL THEN town1_count
    ELSE 0
  END,
  town2_name = COALESCE($10, town2_name),
  town2_count = CASE
    WHEN $10 IS NULL THEN town2_count
    ELSE 0
  END
WHERE id = $1
RETURNING bio,
  cert_agreement,
  email,
  image_urls,
  name,
  nickname,
  service_agreement,
  town1_name,
  town2_name;