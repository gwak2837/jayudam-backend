/** Types generated for queries found in "src/routes/chat/sql/createChatroom.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'CreateChatroom' is invalid, so its result is assigned type 'never' */
export type ICreateChatroomResult = never;

/** Query 'CreateChatroom' is invalid, so its parameters are assigned type 'never' */
export type ICreateChatroomParams = never;

const createChatroomIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  new_chatroom_id,\n  r\nFROM\n  create_chatroom ('00000000-0000-0000-0000-000000000000', '9617f298-2fe5-4e81-872a-04226ce9d9e9')"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   new_chatroom_id,
 *   r
 * FROM
 *   create_chatroom ('00000000-0000-0000-0000-000000000000', '9617f298-2fe5-4e81-872a-04226ce9d9e9')
 * ```
 */
export const createChatroom = new PreparedQuery<ICreateChatroomParams,ICreateChatroomResult>(createChatroomIR);


