/* @name deleteChatroom */
DELETE FROM chatroom_x_user
WHERE chatroom_id = $1
  AND user_id = $2
RETURNING
  chatroom_id;

