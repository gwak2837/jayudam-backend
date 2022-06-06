/* @name findKakaoUser */
SELECT id,
  nickname,
  phone_number
FROM "user"
WHERE kakao_oauth = $1;