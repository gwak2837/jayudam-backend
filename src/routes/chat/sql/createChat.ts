/** Types generated for queries found in "src/routes/chat/sql/createChat.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateChat' parameters type */
export type ICreateChatParams = void;

/** 'CreateChat' return type */
export interface ICreateChatResult {
  creation_time: Date;
  id: string;
}

/** 'CreateChat' query type */
export interface ICreateChatQuery {
  params: ICreateChatParams;
  result: ICreateChatResult;
}

const createChatIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO chat (content, \"type\", chatroom_id, user_id)\n  VALUES ($1, $2, $3, $4)\nRETURNING\n  id, creation_time"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO chat (content, "type", chatroom_id, user_id)
 *   VALUES ($1, $2, $3, $4)
 * RETURNING
 *   id, creation_time
 * ```
 */
export const createChat = new PreparedQuery<ICreateChatParams,ICreateChatResult>(createChatIR);


