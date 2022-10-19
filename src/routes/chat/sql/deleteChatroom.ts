/** Types generated for queries found in "src/routes/chat/sql/deleteChatroom.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'DeleteChatroom' parameters type */
export type IDeleteChatroomParams = void;

/** 'DeleteChatroom' return type */
export interface IDeleteChatroomResult {
  chatroom_id: string;
}

/** 'DeleteChatroom' query type */
export interface IDeleteChatroomQuery {
  params: IDeleteChatroomParams;
  result: IDeleteChatroomResult;
}

const deleteChatroomIR: any = {"usedParamSet":{},"params":[],"statement":"DELETE FROM chatroom_x_user\nWHERE chatroom_id = $1\n  AND user_id = $2\nRETURNING\n  chatroom_id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM chatroom_x_user
 * WHERE chatroom_id = $1
 *   AND user_id = $2
 * RETURNING
 *   chatroom_id
 * ```
 */
export const deleteChatroom = new PreparedQuery<IDeleteChatroomParams,IDeleteChatroomResult>(deleteChatroomIR);


