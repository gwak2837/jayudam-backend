/* @name getNaverUser */
SELECT id,
  nickname
FROM "user"
WHERE naver_oauth = $1;