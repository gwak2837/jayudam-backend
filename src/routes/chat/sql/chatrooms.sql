/* @name chatrooms */
SELECT
  chatroom.id AS chatroom__id,
  COUNT(c3.id) AS chatroom__unread_count,
  "user".name AS user__name,
  "user".nickname AS user__nickname,
  "user".image_urls[1] AS user__image_url,
  chat.id AS chat__id,
  chat.creation_time AS chat__creation_time,
  chat.content AS chat__content,
  chat."type" AS chat__type
FROM
  chatroom
  JOIN chatroom_x_user ON chatroom_x_user.chatroom_id = chatroom.id
    AND chatroom_x_user.user_id = $1
  LEFT JOIN chatroom_x_user AS cxu ON cxu.chatroom_id = chatroom_x_user.chatroom_id
    AND cxu.user_id != $1
  LEFT JOIN "user" ON "user".id = cxu.user_id
  LEFT JOIN chat ON chat.chatroom_id = chatroom.id
  LEFT JOIN chat c2 ON c2.chatroom_id = chatroom.id
    AND chat.id < c2.id
  LEFT JOIN chat c3 ON c3.chatroom_id = chatroom.id
    AND c3.id > COALESCE(chatroom_x_user.last_chat_id, 0)
WHERE
  c2.id IS NULL
GROUP BY
  chatroom.id,
  "user".id,
  chat.id
ORDER BY
  chat.creation_time DESC NULLS LAST;

