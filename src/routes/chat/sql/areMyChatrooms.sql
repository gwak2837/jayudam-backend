/* @name areMyChatrooms */
SELECT (
    SELECT array_agg(chatroom_id)
    FROM chatroom_x_user
    WHERE user_id = $1
  ) @> $2 AS are_all_included;