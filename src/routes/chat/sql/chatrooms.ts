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
  chatroom__image_url: string | null;
  chatroom__name: string;
  chatroom__unread_count: string | null;
}

/** 'Chatrooms' query type */
export interface IChatroomsQuery {
  params: IChatroomsParams;
  result: IChatroomsResult;
}

const chatroomsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT chatroom.id AS chatroom__id,\n  chatroom.name AS chatroom__name,\n  chatroom.image_url AS chatroom__image_url,\n  COUNT(c3.id) AS chatroom__unread_count,\n  chat.id AS chat__id,\n  chat.creation_time AS chat__creation_time,\n  chat.content AS chat__content,\n  chat.\"type\" AS chat__type\nFROM chatroom_x_user\n  JOIN chatroom ON chatroom.id = chatroom_x_user.chatroom_id\n  AND chatroom_x_user.user_id = $1\n  LEFT JOIN chat ON chat.chatroom_id = chatroom.id\n  LEFT JOIN chat c2 ON c2.chatroom_id = chatroom.id\n  AND chat.id < c2.id\n  LEFT JOIN chat c3 ON c3.id > chatroom_x_user.last_chat_id\nWHERE c2.id IS NULL\nGROUP BY chatroom.id,\n  chat.id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT chatroom.id AS chatroom__id,
 *   chatroom.name AS chatroom__name,
 *   chatroom.image_url AS chatroom__image_url,
 *   COUNT(c3.id) AS chatroom__unread_count,
 *   chat.id AS chat__id,
 *   chat.creation_time AS chat__creation_time,
 *   chat.content AS chat__content,
 *   chat."type" AS chat__type
 * FROM chatroom_x_user
 *   JOIN chatroom ON chatroom.id = chatroom_x_user.chatroom_id
 *   AND chatroom_x_user.user_id = $1
 *   LEFT JOIN chat ON chat.chatroom_id = chatroom.id
 *   LEFT JOIN chat c2 ON c2.chatroom_id = chatroom.id
 *   AND chat.id < c2.id
 *   LEFT JOIN chat c3 ON c3.id > chatroom_x_user.last_chat_id
 * WHERE c2.id IS NULL
 * GROUP BY chatroom.id,
 *   chat.id
 * ```
 */
export const chatrooms = new PreparedQuery<IChatroomsParams,IChatroomsResult>(chatroomsIR);


