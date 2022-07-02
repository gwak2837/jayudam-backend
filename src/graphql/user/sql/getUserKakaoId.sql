/* @name getUserKakaoId */
SELECT oauth_kakao
FROM "user"
WHERE id = $1
  AND nickname = $2;