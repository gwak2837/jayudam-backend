/* @name putUserToSleep */
UPDATE "user"
SET update_time = CURRENT_TIMESTAMP,
  bio = NULL,
  birthyear = NULL,
  birthday = NULL,
  image_urls = NULL,
  is_verified_birthyear = FALSE,
  is_verified_birthday = FALSE,
  is_verified_email = FALSE,
  is_verified_name = FALSE,
  is_verified_phone_number = FALSE,
  is_verified_sex = FALSE,
  locations = NULL,
  locations_verification_count = NULL,
  name = NULL,
  sex = NULL,
  sleeping_time = CURRENT_TIMESTAMP
WHERE id = $1;