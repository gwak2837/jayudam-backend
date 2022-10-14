/** Types generated for queries found in "src/fastify/chat/sql/areMyChatrooms.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'AreMyChatrooms' parameters type */
export type IAreMyChatroomsParams = void;

/** 'AreMyChatrooms' return type */
export interface IAreMyChatroomsResult {
  are_all_included: boolean | null;
}

/** 'AreMyChatrooms' query type */
export interface IAreMyChatroomsQuery {
  params: IAreMyChatroomsParams;
  result: IAreMyChatroomsResult;
}

const areMyChatroomsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT (\n    SELECT array_agg(chatroom_id)\n    FROM chatroom_x_user\n    WHERE user_id = $1\n  ) @> $2 AS are_all_included"};

/**
 * Query generated from SQL:
 * ```
 * SELECT (
 *     SELECT array_agg(chatroom_id)
 *     FROM chatroom_x_user
 *     WHERE user_id = $1
 *   ) @> $2 AS are_all_included
 * ```
 */
export const areMyChatrooms = new PreparedQuery<IAreMyChatroomsParams,IAreMyChatroomsResult>(areMyChatroomsIR);


