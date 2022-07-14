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
  name = NULL,
  sex = NULL,
  sleeping_time = CURRENT_TIMESTAMP,
  town1_count = 0,
  town1_name = NULL,
  town2_count = 0,
  town2_name = NULL
WHERE id = $1;