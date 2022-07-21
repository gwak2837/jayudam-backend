/* @name createVerificationHistories */
INSERT INTO verification_history (content, user_id)
VALUES ($1, $2);