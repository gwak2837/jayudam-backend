/** Types generated for queries found in "src/express/oauth/sql/registerBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'RegisterBBatonUser' parameters type */
export type IRegisterBBatonUserParams = void

/** 'RegisterBBatonUser' return type */
export interface IRegisterBBatonUserResult {
  id: string
}

/** 'RegisterBBatonUser' query type */
export interface IRegisterBBatonUserQuery {
  params: IRegisterBBatonUserParams
  result: IRegisterBBatonUserResult
}

const registerBBatonUserIR: any = {
  usedParamSet: {},
  params: [],
  statement:
    'INSERT INTO "user" (\n    email,\n    nickname,\n    phone_number,\n    birthyear,\n    birthday,\n    sex,\n    bio,\n    image_url,\n    bbaton_oauth\n  )\nVALUES(\n    $1,\n    $2,\n    $3,\n    $4,\n    $5,\n    $6,\n    $7,\n    $8,\n    $9\n  )\nRETURNING id',
}

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
 *     bbaton_oauth
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
export const registerBBatonUser = new PreparedQuery<
  IRegisterBBatonUserParams,
  IRegisterBBatonUserResult
>(registerBBatonUserIR)
