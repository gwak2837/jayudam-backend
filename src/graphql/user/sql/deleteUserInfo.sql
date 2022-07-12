/* @name deleteUserInfo */
UPDATE "user"
SET creation_time = NULL,
  update_time = NULL,
  bio = NULL,
  birthyear = NULL,
  birthday = NULL,
  cherry = 0,
  deactivation_time = NULL,
  email = NULL,
  grade = NULL,
  image_urls = NULL,
  invitation_code = NULL,
  is_verified_birthyear = FALSE,
  is_verified_birthday = FALSE,
  is_verified_email = FALSE,
  is_verified_name = FALSE,
  is_verified_phone_number = FALSE,
  last_attendance = NULL,
  locations = NULL,
  name = NULL,
  nickname = NULL,
  phone_number = NULL,
  settings = NULL,
  sex = NULL,
  sleeping_time = NULL
WHERE id = $1
RETURNING blocking_start_time;