/** Types generated for queries found in "src/express/oauth/sql/getNaverUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetNaverUser' parameters type */
export type IGetNaverUserParams = void;

/** 'GetNaverUser' return type */
export interface IGetNaverUserResult {
  id: string;
  nickname: string | null;
}

/** 'GetNaverUser' query type */
export interface IGetNaverUserQuery {
  params: IGetNaverUserParams;
  result: IGetNaverUserResult;
}

const getNaverUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname\nFROM \"user\"\nWHERE naver_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname
 * FROM "user"
 * WHERE naver_oauth = $1
 * ```
 */
export const getNaverUser = new PreparedQuery<IGetNaverUserParams,IGetNaverUserResult>(getNaverUserIR);


