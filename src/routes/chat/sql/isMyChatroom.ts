/** Types generated for queries found in "src/routes/chat/sql/isMyChatroom.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'IsMyChatroom' parameters type */
export type IIsMyChatroomParams = void;

/** 'IsMyChatroom' return type */
export interface IIsMyChatroomResult {
  user_id: string;
}

/** 'IsMyChatroom' query type */
export interface IIsMyChatroomQuery {
  params: IIsMyChatroomParams;
  result: IIsMyChatroomResult;
}

const isMyChatroomIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  user_id\nFROM\n  chatroom_x_user\nWHERE\n  chatroom_id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   user_id
 * FROM
 *   chatroom_x_user
 * WHERE
 *   chatroom_id = $1
 * ```
 */
export const isMyChatroom = new PreparedQuery<IIsMyChatroomParams,IIsMyChatroomResult>(isMyChatroomIR);


