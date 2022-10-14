/* @name createChat */
INSERT INTO chat (content, "type", user_id)
VALUES ($1, $2, $3)
RETURNING id,
  creation_time;