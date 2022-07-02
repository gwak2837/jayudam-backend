/** Types generated for queries found in "src/express/oauth/sql/registerBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'RegisterBBatonUser' parameters type */
export type IRegisterBBatonUserParams = void;

/** 'RegisterBBatonUser' return type */
export interface IRegisterBBatonUserResult {
  id: string;
}

/** 'RegisterBBatonUser' query type */
export interface IRegisterBBatonUserQuery {
  params: IRegisterBBatonUserParams;
  result: IRegisterBBatonUserResult;
}

const registerBBatonUserIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO \"user\" (\n    is_verified_sex,\n    sex,\n    personal_data_storing_period,\n    oauth_bbaton\n  )\nVALUES(TRUE, $1, $2, $3)\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "user" (
 *     is_verified_sex,
 *     sex,
 *     personal_data_storing_period,
 *     oauth_bbaton
 *   )
 * VALUES(TRUE, $1, $2, $3)
 * RETURNING id
 * ```
 */
export const registerBBatonUser = new PreparedQuery<IRegisterBBatonUserParams,IRegisterBBatonUserResult>(registerBBatonUserIR);


