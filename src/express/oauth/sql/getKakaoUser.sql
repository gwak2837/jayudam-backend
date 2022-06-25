/* @name getKakaoUser */
SELECT id,
  blocking_start_time,
  blocking_end_time,
  nickname,
  name,
  sex,
  birthyear,
  birthday,
  phone_number,
  sleeping_time
FROM "user"
WHERE kakao_oauth = $1;