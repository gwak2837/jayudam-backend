/** Types generated for queries found in "src/fastify/chat/sql/createChat.sql" */
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

const createChatIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO chat (content, \"type\", user_id)\nVALUES ($1, $2, $3)\nRETURNING id,\n  creation_time"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO chat (content, "type", user_id)
 * VALUES ($1, $2, $3)
 * RETURNING id,
 *   creation_time
 * ```
 */
export const createChat = new PreparedQuery<ICreateChatParams,ICreateChatResult>(createChatIR);


