/** Types generated for queries found in "src/express/oauth/sql/getKakaoUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetKakaoUser' parameters type */
export type IGetKakaoUserParams = void;

/** 'GetKakaoUser' return type */
export interface IGetKakaoUserResult {
  birthday: string | null;
  birthyear: string | null;
  id: string;
  name: string | null;
  nickname: string | null;
  phone_number: string | null;
  sex: number;
}

/** 'GetKakaoUser' query type */
export interface IGetKakaoUserQuery {
  params: IGetKakaoUserParams;
  result: IGetKakaoUserResult;
}

const getKakaoUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname,\n  name,\n  sex,\n  birthyear,\n  birthday,\n  phone_number\nFROM \"user\"\nWHERE kakao_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname,
 *   name,
 *   sex,
 *   birthyear,
 *   birthday,
 *   phone_number
 * FROM "user"
 * WHERE kakao_oauth = $1
 * ```
 */
export const getKakaoUser = new PreparedQuery<IGetKakaoUserParams,IGetKakaoUserResult>(getKakaoUserIR);


