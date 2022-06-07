/* @name getKakaoUser */
SELECT id,
  nickname
FROM "user"
WHERE kakao_oauth = $1;