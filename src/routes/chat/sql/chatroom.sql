/* @name chatroom */
SELECT
  chat.id AS chat__id,
  chat.creation_time AS chat__creation_time,
  chat.content AS chat__content,
  chat.type AS chat__type,
  "user".id AS user__id,
  "user".name AS user__name,
  "user".nickname AS user__nickname
FROM
  chatroom_x_user
  LEFT JOIN chat ON chat.chatroom_id = chatroom_x_user.chatroom_id
    AND chatroom_x_user.user_id = $1
    AND chatroom_x_user.chatroom_id = $2
  LEFT JOIN "user" ON "user".id = chat.user_id
WHERE
  chat.id < $3
LIMIT $4;

