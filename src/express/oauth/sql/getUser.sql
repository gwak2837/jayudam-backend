/* @name getUser */
SELECT id,
  nickname,
  sex,
  birthyear,
  birthday,
  email,
  name,
  phone_number,
  image_urls,
  oauth_google,
  oauth_kakao,
  oauth_naver
FROM "user"
WHERE id = $1;