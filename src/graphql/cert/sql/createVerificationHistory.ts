/** Types generated for queries found in "src/graphql/cert/sql/createVerificationHistory.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateVerificationHistory' parameters type */
export type ICreateVerificationHistoryParams = void;

/** 'CreateVerificationHistory' return type */
export interface ICreateVerificationHistoryResult {
  creation_time: Date;
  id: string;
}

/** 'CreateVerificationHistory' query type */
export interface ICreateVerificationHistoryQuery {
  params: ICreateVerificationHistoryParams;
  result: ICreateVerificationHistoryResult;
}

const createVerificationHistoryIR: any = {"usedParamSet":{},"params":[],"statement":"INSERT INTO verification_history (content, user_id)\nVALUES ($1, $2)\nRETURNING id,\n  creation_time"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO verification_history (content, user_id)
 * VALUES ($1, $2)
 * RETURNING id,
 *   creation_time
 * ```
 */
export const createVerificationHistory = new PreparedQuery<ICreateVerificationHistoryParams,ICreateVerificationHistoryResult>(createVerificationHistoryIR);


