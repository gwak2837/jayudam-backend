/* @name getUserKakaoId */
SELECT kakao_oauth
FROM "user"
WHERE id = $1
  AND nickname = $2;