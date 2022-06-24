/* @name getNaverUser */
SELECT id,
  nickname,
  sex,
  birthyear,
  birthday,
  name,
  phone_number
FROM "user"
WHERE naver_oauth = $1;