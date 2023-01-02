/** Types generated for queries found in "src/routes/chat/sql/chatroom.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Chatroom' parameters type */
export type IChatroomParams = void;

/** 'Chatroom' return type */
export interface IChatroomResult {
  content: string;
  creation_time: Date;
  id: string;
  type: number;
  user__id: string;
  user__name: string | null;
  user__nickname: string | null;
}

/** 'Chatroom' query type */
export interface IChatroomQuery {
  params: IChatroomParams;
  result: IChatroomResult;
}

const chatroomIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  chat.id,\n  chat.creation_time,\n  chat.content,\n  chat.type,\n  \"user\".id AS user__id,\n  \"user\".name AS user__name,\n  \"user\".nickname AS user__nickname\nFROM\n  chatroom_x_user\n  LEFT JOIN chat ON chat.chatroom_id = chatroom_x_user.chatroom_id\n    AND chatroom_x_user.user_id = $1\n    AND chatroom_x_user.chatroom_id = $2\n  LEFT JOIN \"user\" ON \"user\".id = chat.user_id\nWHERE\n  chat.id < $3\nORDER BY\n  chat.id DESC\nLIMIT $4"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   chat.id,
 *   chat.creation_time,
 *   chat.content,
 *   chat.type,
 *   "user".id AS user__id,
 *   "user".name AS user__name,
 *   "user".nickname AS user__nickname
 * FROM
 *   chatroom_x_user
 *   LEFT JOIN chat ON chat.chatroom_id = chatroom_x_user.chatroom_id
 *     AND chatroom_x_user.user_id = $1
 *     AND chatroom_x_user.chatroom_id = $2
 *   LEFT JOIN "user" ON "user".id = chat.user_id
 * WHERE
 *   chat.id < $3
 * ORDER BY
 *   chat.id DESC
 * LIMIT $4
 * ```
 */
export const chatroom = new PreparedQuery<IChatroomParams,IChatroomResult>(chatroomIR);


