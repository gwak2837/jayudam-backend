/* @name getCerts */
SELECT id,
  birthdate,
  content,
  effective_date,
  issue_date,
  name,
  sex,
  "type"
FROM cert
WHERE user_id = $1
  AND "type" = ANY ($2);