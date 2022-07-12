/* @name getCertificates */
SELECT id,
  birth_date,
  content,
  effective_date,
  issue_date,
  name,
  sex,
  "type"
FROM certificate
WHERE user_id = $1
  AND "type" = ANY ($2)
  AND effective_date > $3;