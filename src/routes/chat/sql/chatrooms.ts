/** Types generated for queries found in "src/routes/chat/sql/chatrooms.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Chatrooms' parameters type */
export type IChatroomsParams = void;

/** 'Chatrooms' return type */
export interface IChatroomsResult {
  chat__content: string;
  chat__creation_time: Date;
  chat__id: string;
  chat__type: number;
  chatroom__id: string;
  chatroom__unread_count: string | null;
  user__image_url: string | null;
  user__name: string | null;
  user__nickname: string | null;
}

/** 'Chatrooms' query type */
export interface IChatroomsQuery {
  params: IChatroomsParams;
  result: IChatroomsResult;
}

const chatroomsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  chatroom.id AS chatroom__id,\n  COUNT(c3.id) AS chatroom__unread_count,\n  \"user\".name AS user__name,\n  \"user\".nickname AS user__nickname,\n  \"user\".image_urls[1] AS user__image_url,\n  chat.id AS chat__id,\n  chat.creation_time AS chat__creation_time,\n  chat.content AS chat__content,\n  chat.\"type\" AS chat__type\nFROM\n  chatroom\n  JOIN chatroom_x_user ON chatroom_x_user.chatroom_id = chatroom.id\n    AND chatroom_x_user.user_id = $1\n  LEFT JOIN chatroom_x_user AS cxu ON cxu.chatroom_id = chatroom_x_user.chatroom_id\n    AND cxu.user_id != $1\n  LEFT JOIN \"user\" ON \"user\".id = cxu.user_id\n  LEFT JOIN chat ON chat.chatroom_id = chatroom.id\n  LEFT JOIN chat c2 ON c2.chatroom_id = chatroom.id\n    AND chat.id < c2.id\n  LEFT JOIN chat c3 ON c3.chatroom_id = chatroom.id\n    AND c3.id > COALESCE(chatroom_x_user.last_chat_id, 0)\nWHERE\n  c2.id IS NULL\nGROUP BY\n  chatroom.id,\n  \"user\".id,\n  chat.id\nORDER BY\n  chat.creation_time DESC NULLS LAST"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   chatroom.id AS chatroom__id,
 *   COUNT(c3.id) AS chatroom__unread_count,
 *   "user".name AS user__name,
 *   "user".nickname AS user__nickname,
 *   "user".image_urls[1] AS user__image_url,
 *   chat.id AS chat__id,
 *   chat.creation_time AS chat__creation_time,
 *   chat.content AS chat__content,
 *   chat."type" AS chat__type
 * FROM
 *   chatroom
 *   JOIN chatroom_x_user ON chatroom_x_user.chatroom_id = chatroom.id
 *     AND chatroom_x_user.user_id = $1
 *   LEFT JOIN chatroom_x_user AS cxu ON cxu.chatroom_id = chatroom_x_user.chatroom_id
 *     AND cxu.user_id != $1
 *   LEFT JOIN "user" ON "user".id = cxu.user_id
 *   LEFT JOIN chat ON chat.chatroom_id = chatroom.id
 *   LEFT JOIN chat c2 ON c2.chatroom_id = chatroom.id
 *     AND chat.id < c2.id
 *   LEFT JOIN chat c3 ON c3.chatroom_id = chatroom.id
 *     AND c3.id > COALESCE(chatroom_x_user.last_chat_id, 0)
 * WHERE
 *   c2.id IS NULL
 * GROUP BY
 *   chatroom.id,
 *   "user".id,
 *   chat.id
 * ORDER BY
 *   chat.creation_time DESC NULLS LAST
 * ```
 */
export const chatrooms = new PreparedQuery<IChatroomsParams,IChatroomsResult>(chatroomsIR);


