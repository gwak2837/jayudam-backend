/** Types generated for queries found in "src/express/oauth/sql/getNaverUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetNaverUser' parameters type */
export type IGetNaverUserParams = void;

/** 'GetNaverUser' return type */
export interface IGetNaverUserResult {
  birthday: string | null;
  birthyear: string | null;
  id: string;
  name: string | null;
  nickname: string | null;
  phone_number: string | null;
  sex: number;
}

/** 'GetNaverUser' query type */
export interface IGetNaverUserQuery {
  params: IGetNaverUserParams;
  result: IGetNaverUserResult;
}

const getNaverUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname,\n  sex,\n  birthyear,\n  birthday,\n  name,\n  phone_number\nFROM \"user\"\nWHERE naver_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname,
 *   sex,
 *   birthyear,
 *   birthday,
 *   name,
 *   phone_number
 * FROM "user"
 * WHERE naver_oauth = $1
 * ```
 */
export const getNaverUser = new PreparedQuery<IGetNaverUserParams,IGetNaverUserResult>(getNaverUserIR);


