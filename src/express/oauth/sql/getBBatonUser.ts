/** Types generated for queries found in "src/express/oauth/sql/getBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'GetBBatonUser' is invalid, so its result is assigned type 'never' */
export type IGetBBatonUserResult = never;

/** Query 'GetBBatonUser' is invalid, so its parameters are assigned type 'never' */
export type IGetBBatonUserParams = never;

const getBBatonUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname\nFROM \"user\"\nWHERE bbaton_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname
 * FROM "user"
 * WHERE bbaton_oauth = $1
 * ```
 */
export const getBBatonUser = new PreparedQuery<IGetBBatonUserParams,IGetBBatonUserResult>(getBBatonUserIR);


