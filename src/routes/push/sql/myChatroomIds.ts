/** Types generated for queries found in "src/routes/push/sql/myChatroomIds.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'MyChatroomIds' parameters type */
export type IMyChatroomIdsParams = void;

/** 'MyChatroomIds' return type */
export interface IMyChatroomIdsResult {
  chatroom_id: string;
}

/** 'MyChatroomIds' query type */
export interface IMyChatroomIdsQuery {
  params: IMyChatroomIdsParams;
  result: IMyChatroomIdsResult;
}

const myChatroomIdsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT chatroom_x_user.chatroom_id\nFROM chatroom_x_user\nWHERE chatroom_x_user.user_id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT chatroom_x_user.chatroom_id
 * FROM chatroom_x_user
 * WHERE chatroom_x_user.user_id = $1
 * ```
 */
export const myChatroomIds = new PreparedQuery<IMyChatroomIdsParams,IMyChatroomIdsResult>(myChatroomIdsIR);


