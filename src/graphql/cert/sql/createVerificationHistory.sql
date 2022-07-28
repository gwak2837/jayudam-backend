/* @name createVerificationHistory */
INSERT INTO verification_history (content, user_id)
VALUES ($1, $2)
RETURNING id,
  creation_time;