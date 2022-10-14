/* @name isMyChatroom */
SELECT user_id
FROM chatroom_x_user
WHERE chatroom_id = $1;