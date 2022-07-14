/* @name updateUser */
/* WIP: need to avoid updating WITH the same value */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  bio = COALESCE($2, bio),
  certificate_agreement = COALESCE($3, certificate_agreement),
  email = COALESCE($4, email),
  image_urls = COALESCE($5, image_urls),
  nickname = COALESCE($6, nickname),
  town1_name = COALESCE($7, town1_name),
  town1_count = CASE
    WHEN $7 IS NULL THEN town1_count
    ELSE 0
  END,
  town2_name = COALESCE($8, town2_name),
  town2_count = CASE
    WHEN $8 IS NULL THEN town2_count
    ELSE 0
  END
WHERE id = $1
RETURNING bio,
  certificate_agreement,
  email,
  image_urls,
  nickname,
  town1_name,
  town2_name;