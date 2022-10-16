/* @name chatroomIds */
SELECT chatroom_x_user.chatroom_id
FROM chatroom_x_user
WHERE chatroom_x_user.user_id = $1;