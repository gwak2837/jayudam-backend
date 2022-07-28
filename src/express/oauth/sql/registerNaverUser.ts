/** Types generated for queries found in "src/express/oauth/sql/registerNaverUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'RegisterNaverUser' parameters type */
export type IRegisterNaverUserParams = void;

/** 'RegisterNaverUser' return type */
export interface IRegisterNaverUserResult {
  id: string;
}

/** 'RegisterNaverUser' query type */
export interface IRegisterNaverUserQuery {
  params: IRegisterNaverUserParams;
  result: IRegisterNaverUserResult;
}

const registerNaverUserIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO \"user\" (\n    email,\n    nickname,\n    phone_number,\n    birthyear,\n    birthday,\n    sex,\n    bio,\n    image_urls,\n    oauth_naver\n  )\nVALUES(\n    $1,\n    $2,\n    $3,\n    $4,\n    $5,\n    $6,\n    $7,\n    $8,\n    $9\n  )\nRETURNING id"};

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
 *     image_urls,
 *     oauth_naver
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
export const registerNaverUser = new PreparedQuery<IRegisterNaverUserParams,IRegisterNaverUserResult>(registerNaverUserIR);


