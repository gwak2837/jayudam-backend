/** Types generated for queries found in "src/routes/chat/sql/createChatroom.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateChatroom' parameters type */
export type ICreateChatroomParams = void;

/** 'CreateChatroom' return type */
export interface ICreateChatroomResult {
  new_chatroom_id: string | null;
}

/** 'CreateChatroom' query type */
export interface ICreateChatroomQuery {
  params: ICreateChatroomParams;
  result: ICreateChatroomResult;
}

const createChatroomIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  new_chatroom_id\nFROM\n  create_chatroom ($1, $2)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   new_chatroom_id
 * FROM
 *   create_chatroom ($1, $2)
 * ```
 */
export const createChatroom = new PreparedQuery<ICreateChatroomParams,ICreateChatroomResult>(createChatroomIR);


