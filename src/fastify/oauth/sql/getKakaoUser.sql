/* @name getKakaoUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  legal_name,
  name,
  sex,
  birthyear,
  birthday,
  phone_number,
  sleeping_time
FROM "user"
WHERE oauth_kakao = $1;