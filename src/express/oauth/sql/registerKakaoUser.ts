/** Types generated for queries found in "src/express/oauth/sql/registerKakaoUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'RegisterKakaoUser' parameters type */
export type IRegisterKakaoUserParams = void;

/** 'RegisterKakaoUser' return type */
export interface IRegisterKakaoUserResult {
  id: string;
}

/** 'RegisterKakaoUser' query type */
export interface IRegisterKakaoUserQuery {
  params: IRegisterKakaoUserParams;
  result: IRegisterKakaoUserResult;
}

const registerKakaoUserIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO \"user\" (\n    email,\n    nickname,\n    phone_number,\n    birthyear,\n    birthday,\n    sex,\n    bio,\n    image_url,\n    kakao_oauth\n  )\nVALUES(\n    $1,\n    $2,\n    $3,\n    $4,\n    $5,\n    $6,\n    $7,\n    $8,\n    $9\n  )\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "user" (
 *     email,
 *     nickname,
 *     phone_number,
 *     birthyear,
 *     birthday,
 *     sex,
 *     bio,
 *     image_url,
 *     kakao_oauth
 *   )
 * VALUES(
 *     $1,
 *     $2,
 *     $3,
 *     $4,
 *     $5,
 *     $6,
 *     $7,
 *     $8,
 *     $9
 *   )
 * RETURNING id
 * ```
 */
export const registerKakaoUser = new PreparedQuery<IRegisterKakaoUserParams,IRegisterKakaoUserResult>(registerKakaoUserIR);


