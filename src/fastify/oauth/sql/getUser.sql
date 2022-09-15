/* @name getUser */
SELECT id,
  birthyear,
  birthday,
  email,
  image_urls,
  legal_name,
  name,
  oauth_google,
  oauth_kakao,
  oauth_naver,
  phone_number,
  sex
FROM "user"
WHERE id = $1;