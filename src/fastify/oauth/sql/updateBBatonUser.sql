/* @name updateBBatonUser */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  is_verified_sex = TRUE,
  sex = $2
WHERE id = $1;