/* @name getNaverUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  legal_name,
  sex,
  birthyear,
  birthday,
  name,
  phone_number,
  sleeping_time
FROM "user"
WHERE oauth_naver = $1;