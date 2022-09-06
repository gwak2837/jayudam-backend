/** Types generated for queries found in "src/express/oauth/sql/getNaverUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetNaverUser' parameters type */
export type IGetNaverUserParams = void;

/** 'GetNaverUser' return type */
export interface IGetNaverUserResult {
  birthday: string | null;
  birthyear: number | null;
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  id: string;
  legal_name: string | null;
  name: string | null;
  phone_number: string | null;
  sex: number | null;
  sleeping_time: Date | null;
}

/** 'GetNaverUser' query type */
export interface IGetNaverUserQuery {
  params: IGetNaverUserParams;
  result: IGetNaverUserResult;
}

const getNaverUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  blocking_start_time,\n  blocking_end_time,\n  legal_name,\n  sex,\n  birthyear,\n  birthday,\n  name,\n  phone_number,\n  sleeping_time\nFROM \"user\"\nWHERE oauth_naver = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   blocking_start_time,
 *   blocking_end_time,
 *   legal_name,
 *   sex,
 *   birthyear,
 *   birthday,
 *   name,
 *   phone_number,
 *   sleeping_time
 * FROM "user"
 * WHERE oauth_naver = $1
 * ```
 */
export const getNaverUser = new PreparedQuery<IGetNaverUserParams,IGetNaverUserResult>(getNaverUserIR);


