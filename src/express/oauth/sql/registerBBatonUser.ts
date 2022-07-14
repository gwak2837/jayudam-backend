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
    'INSERT INTO "user" (\n    is_verified_sex,\n    oauth_bbaton,\n    personal_data_storing_year,\n    sex\n  )\nVALUES(TRUE, $1, $2, $3)\nRETURNING id',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "user" (
 *     is_verified_sex,
 *     oauth_bbaton,
 *     personal_data_storing_year,
 *     sex
 *   )
 * VALUES(TRUE, $1, $2, $3)
 * RETURNING id
 * ```
 */
export const registerBBatonUser = new PreparedQuery<
  IRegisterBBatonUserParams,
  IRegisterBBatonUserResult
>(registerBBatonUserIR)
