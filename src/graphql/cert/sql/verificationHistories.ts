/** Types generated for queries found in "src/graphql/cert/sql/verificationHistories.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'VerificationHistories' parameters type */
export type IVerificationHistoriesParams = void

/** 'VerificationHistories' return type */
export interface IVerificationHistoriesResult {
  content: string
  creation_time: Date
  id: string
}

/** 'VerificationHistories' query type */
export interface IVerificationHistoriesQuery {
  params: IVerificationHistoriesParams
  result: IVerificationHistoriesResult
}

const verificationHistoriesIR: any = {
  usedParamSet: {},
  params: [],
  statement:
    'SELECT id,\n  creation_time,\n  content\nFROM verification_history\nWHERE user_id = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   creation_time,
 *   content
 * FROM verification_history
 * WHERE user_id = $1
 * ```
 */
export const verificationHistories = new PreparedQuery<
  IVerificationHistoriesParams,
  IVerificationHistoriesResult
>(verificationHistoriesIR)
