/* @name awakeBBatonUser */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  is_verified_sex = TRUE,
  sex = $2,
  sleeping_time = NULL
WHERE id = $1;