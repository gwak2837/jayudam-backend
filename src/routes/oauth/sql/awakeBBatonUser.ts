/** Types generated for queries found in "src/routes/oauth/sql/awakeBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'AwakeBBatonUser' parameters type */
export type IAwakeBBatonUserParams = void;

/** 'AwakeBBatonUser' return type */
export type IAwakeBBatonUserResult = void;

/** 'AwakeBBatonUser' query type */
export interface IAwakeBBatonUserQuery {
  params: IAwakeBBatonUserParams;
  result: IAwakeBBatonUserResult;
}

const awakeBBatonUserIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  is_verified_sex = TRUE,\n  sex = $2,\n  sleeping_time = NULL\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
 *   is_verified_sex = TRUE,
 *   sex = $2,
 *   sleeping_time = NULL
 * WHERE id = $1
 * ```
 */
export const awakeBBatonUser = new PreparedQuery<IAwakeBBatonUserParams,IAwakeBBatonUserResult>(awakeBBatonUserIR);


