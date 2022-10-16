/** Types generated for queries found in "src/routes/chat/sql/chatroomIds.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'ChatroomIds' parameters type */
export type IChatroomIdsParams = void;

/** 'ChatroomIds' return type */
export interface IChatroomIdsResult {
  chatroom_id: string;
}

/** 'ChatroomIds' query type */
export interface IChatroomIdsQuery {
  params: IChatroomIdsParams;
  result: IChatroomIdsResult;
}

const chatroomIdsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT chatroom_x_user.chatroom_id\nFROM chatroom_x_user\nWHERE chatroom_x_user.user_id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT chatroom_x_user.chatroom_id
 * FROM chatroom_x_user
 * WHERE chatroom_x_user.user_id = $1
 * ```
 */
export const chatroomIds = new PreparedQuery<IChatroomIdsParams,IChatroomIdsResult>(chatroomIdsIR);


