/* @name chatrooms */
SELECT chatroom.id AS chatroom__id,
  chatroom.name AS chatroom__name,
  chatroom.image_url AS chatroom__image_url,
  COUNT(c3.id) AS chatroom__unread_count,
  chat.id AS chat__id,
  chat.creation_time AS chat__creation_time,
  chat.content AS chat__content,
  chat."type" AS chat__type
FROM chatroom_x_user
  JOIN chatroom ON chatroom.id = chatroom_x_user.chatroom_id
  AND chatroom_x_user.user_id = $1
  LEFT JOIN chat ON chat.chatroom_id = chatroom.id
  LEFT JOIN chat c2 ON c2.chatroom_id = chatroom.id
  AND chat.id < c2.id
  LEFT JOIN chat c3 ON c3.id > chatroom_x_user.last_chat_id
WHERE c2.id IS NULL
GROUP BY chatroom.id,
  chat.id;