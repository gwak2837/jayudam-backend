/* @name getUserInfo */
SELECT blocking_end_time,
  oauth_kakao,
  oauth_naver,
  oauth_google,
  oauth_bbaton
FROM "user"
WHERE id = $1;