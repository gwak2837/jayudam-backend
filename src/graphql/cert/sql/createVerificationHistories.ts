/** Types generated for queries found in "src/graphql/cert/sql/createVerificationHistories.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'CreateVerificationHistories' is invalid, so its result is assigned type 'never' */
export type ICreateVerificationHistoriesResult = never;

/** Query 'CreateVerificationHistories' is invalid, so its parameters are assigned type 'never' */
export type ICreateVerificationHistoriesParams = never;

const createVerificationHistoriesIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO verification_history (content, user_id)\nVALUES ($1, $2)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO verification_history (content, user_id)
 * VALUES ($1, $2)
 * ```
 */
export const createVerificationHistories = new PreparedQuery<ICreateVerificationHistoriesParams,ICreateVerificationHistoriesResult>(createVerificationHistoriesIR);


