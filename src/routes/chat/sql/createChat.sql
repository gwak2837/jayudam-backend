/* @name createChat */
INSERT INTO chat (content, "type", chatroom_id, user_id)
  VALUES ($1, $2, $3, $4)
RETURNING
  id, creation_time;

