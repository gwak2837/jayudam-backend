/** Types generated for queries found in "src/routes/oauth/sql/updateBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'UpdateBBatonUser' parameters type */
export type IUpdateBBatonUserParams = void;

/** 'UpdateBBatonUser' return type */
export type IUpdateBBatonUserResult = void;

/** 'UpdateBBatonUser' query type */
export interface IUpdateBBatonUserQuery {
  params: IUpdateBBatonUserParams;
  result: IUpdateBBatonUserResult;
}

const updateBBatonUserIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  is_verified_sex = TRUE,\n  sex = $2\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
 *   is_verified_sex = TRUE,
 *   sex = $2
 * WHERE id = $1
 * ```
 */
export const updateBBatonUser = new PreparedQuery<IUpdateBBatonUserParams,IUpdateBBatonUserResult>(updateBBatonUserIR);


