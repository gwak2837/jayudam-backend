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
  locations,
  locations_verification_count,
  name,
  sex
FROM "user"
WHERE id = $1;