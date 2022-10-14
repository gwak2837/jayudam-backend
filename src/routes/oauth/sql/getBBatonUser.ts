/** Types generated for queries found in "src/fastify/oauth/sql/getBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetBBatonUser' parameters type */
export type IGetBBatonUserParams = void;

/** 'GetBBatonUser' return type */
export interface IGetBBatonUserResult {
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  id: string;
  name: string | null;
  sex: number | null;
  sleeping_time: Date | null;
}

/** 'GetBBatonUser' query type */
export interface IGetBBatonUserQuery {
  params: IGetBBatonUserParams;
  result: IGetBBatonUserResult;
}

const getBBatonUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  blocking_start_time,\n  blocking_end_time,\n  name,\n  sex,\n  sleeping_time\nFROM \"user\"\nWHERE oauth_bbaton = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   blocking_start_time,
 *   blocking_end_time,
 *   name,
 *   sex,
 *   sleeping_time
 * FROM "user"
 * WHERE oauth_bbaton = $1
 * ```
 */
export const getBBatonUser = new PreparedQuery<IGetBBatonUserParams,IGetBBatonUserResult>(getBBatonUserIR);


