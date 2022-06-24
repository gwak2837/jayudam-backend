/** Types generated for queries found in "src/express/oauth/sql/getUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetUser' parameters type */
export type IGetUserParams = void;

/** 'GetUser' return type */
export interface IGetUserResult {
  birthday: string | null;
  birthyear: string | null;
  email: string | null;
  google_oauth: string | null;
  id: string;
  image_url: string | null;
  kakao_oauth: string | null;
  name: string | null;
  naver_oauth: string | null;
  nickname: string | null;
  phone_number: string | null;
  sex: number;
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams;
  result: IGetUserResult;
}

const getUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname,\n  sex,\n  birthyear,\n  birthday,\n  email,\n  name,\n  phone_number,\n  image_url,\n  google_oauth,\n  kakao_oauth,\n  naver_oauth\nFROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname,
 *   sex,
 *   birthyear,
 *   birthday,
 *   email,
 *   name,
 *   phone_number,
 *   image_url,
 *   google_oauth,
 *   kakao_oauth,
 *   naver_oauth
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const getUser = new PreparedQuery<IGetUserParams,IGetUserResult>(getUserIR);


