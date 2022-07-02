/** Types generated for queries found in "src/express/oauth/sql/getUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'GetUser' parameters type */
export type IGetUserParams = void;

/** 'GetUser' return type */
export interface IGetUserResult {
  birthday: string | null;
  birthyear: string | null;
  email: string | null;
  id: string;
  image_urls: stringArray | null;
  name: string | null;
  nickname: string | null;
  oauth_google: string | null;
  oauth_kakao: string | null;
  oauth_naver: string | null;
  phone_number: string | null;
  sex: number | null;
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams;
  result: IGetUserResult;
}

const getUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname,\n  sex,\n  birthyear,\n  birthday,\n  email,\n  name,\n  phone_number,\n  image_urls,\n  oauth_google,\n  oauth_kakao,\n  oauth_naver\nFROM \"user\"\nWHERE id = $1"};

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
 *   image_urls,
 *   oauth_google,
 *   oauth_kakao,
 *   oauth_naver
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const getUser = new PreparedQuery<IGetUserParams,IGetUserResult>(getUserIR);


