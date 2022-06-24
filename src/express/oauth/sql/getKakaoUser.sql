/* @name getKakaoUser */
SELECT id,
  nickname,
  name,
  sex,
  birthyear,
  birthday,
  phone_number
FROM "user"
WHERE kakao_oauth = $1;