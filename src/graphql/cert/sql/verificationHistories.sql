/* @name verificationHistories */
SELECT id,
  creation_time,
  content
FROM verification_history
WHERE user_id = $1;