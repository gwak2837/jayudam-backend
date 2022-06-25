/* @name awakeBBatonUser */
UPDATE "user"
SET modification_time = CURRENT_TIMESTAMP,
  is_verified_sex = TRUE,
  sex = $2,
  sleeping_time = NULL
WHERE id = $1;