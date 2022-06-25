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
  google_oauth,
  kakao_oauth,
  naver_oauth
FROM "user"
WHERE id = $1;