/** Types generated for queries found in "src/routes/chat/sql/chatroom.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Chatroom' parameters type */
export type IChatroomParams = void;

/** 'Chatroom' return type */
export interface IChatroomResult {
  chat__content: string;
  chat__creation_time: Date;
  chat__id: string;
  chat__type: number;
  user__id: string;
  user__name: string | null;
  user__nickname: string | null;
}

/** 'Chatroom' query type */
export interface IChatroomQuery {
  params: IChatroomParams;
  result: IChatroomResult;
}

const chatroomIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  chat.id AS chat__id,\n  chat.creation_time AS chat__creation_time,\n  chat.content AS chat__content,\n  chat.type AS chat__type,\n  \"user\".id AS user__id,\n  \"user\".name AS user__name,\n  \"user\".nickname AS user__nickname\nFROM\n  chatroom_x_user\n  LEFT JOIN chat ON chat.chatroom_id = chatroom_x_user.chatroom_id\n    AND chatroom_x_user.user_id = $1\n    AND chatroom_x_user.chatroom_id = $2\n  LEFT JOIN \"user\" ON \"user\".id = chat.user_id\nWHERE\n  chat.id < $3\nLIMIT $4"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   chat.id AS chat__id,
 *   chat.creation_time AS chat__creation_time,
 *   chat.content AS chat__content,
 *   chat.type AS chat__type,
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
 * LIMIT $4
 * ```
 */
export const chatroom = new PreparedQuery<IChatroomParams,IChatroomResult>(chatroomIR);


