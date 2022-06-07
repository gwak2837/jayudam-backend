/** Types generated for queries found in "src/express/oauth/sql/registerGoogleUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'RegisterGoogleUser' parameters type */
export type IRegisterGoogleUserParams = void;

/** 'RegisterGoogleUser' return type */
export interface IRegisterGoogleUserResult {
  id: string;
}

/** 'RegisterGoogleUser' query type */
export interface IRegisterGoogleUserQuery {
  params: IRegisterGoogleUserParams;
  result: IRegisterGoogleUserResult;
}

const registerGoogleUserIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO \"user\" (\n    email,\n    nickname,\n    phone_number,\n    birthyear,\n    birthday,\n    sex,\n    bio,\n    image_url,\n    google_oauth\n  )\nVALUES(\n    $1,\n    $2,\n    $3,\n    $4,\n    $5,\n    $6,\n    $7,\n    $8,\n    $9\n  )\nRETURNING id"};

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
 *     google_oauth
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
export const registerGoogleUser = new PreparedQuery<IRegisterGoogleUserParams,IRegisterGoogleUserResult>(registerGoogleUserIR);


