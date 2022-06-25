/** Types generated for queries found in "src/express/oauth/sql/getBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetBBatonUser' parameters type */
export type IGetBBatonUserParams = void;

/** 'GetBBatonUser' return type */
export interface IGetBBatonUserResult {
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  id: string;
  nickname: string | null;
  sleeping_time: Date | null;
}

/** 'GetBBatonUser' query type */
export interface IGetBBatonUserQuery {
  params: IGetBBatonUserParams;
  result: IGetBBatonUserResult;
}

const getBBatonUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  blocking_start_time,\n  blocking_end_time,\n  nickname,\n  sleeping_time\nFROM \"user\"\nWHERE bbaton_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   blocking_start_time,
 *   blocking_end_time,
 *   nickname,
 *   sleeping_time
 * FROM "user"
 * WHERE bbaton_oauth = $1
 * ```
 */
export const getBBatonUser = new PreparedQuery<IGetBBatonUserParams,IGetBBatonUserResult>(getBBatonUserIR);


