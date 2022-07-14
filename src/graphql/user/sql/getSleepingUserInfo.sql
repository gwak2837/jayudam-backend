/* @name getSleepingUserInfo */
SELECT bio,
  birthyear,
  birthday,
  image_urls,
  is_verified_birthyear,
  is_verified_birthday,
  is_verified_email,
  is_verified_name,
  is_verified_phone_number,
  is_verified_sex,
  name,
  sex,
  town1_count,
  town1_name,
  town2_count,
  town2_name
FROM "user"
WHERE id = $1;