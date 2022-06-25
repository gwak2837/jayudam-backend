/* @name getNaverUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  nickname,
  sex,
  birthyear,
  birthday,
  name,
  phone_number,
  sleeping_time
FROM "user"
WHERE naver_oauth = $1;