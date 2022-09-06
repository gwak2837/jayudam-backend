/** Types generated for queries found in "src/graphql/cert/sql/updateCertAgreement.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'UpdateCertAgreement' parameters type */
export type IUpdateCertAgreementParams = void

/** 'UpdateCertAgreement' return type */
export type IUpdateCertAgreementResult = void

/** 'UpdateCertAgreement' query type */
export interface IUpdateCertAgreementQuery {
  params: IUpdateCertAgreementParams
  result: IUpdateCertAgreementResult
}

const updateCertAgreementIR: any = {
  usedParamSet: {},
  params: [],
  statement:
    'UPDATE "user"\nSET update_time = CURRENT_TIMESTAMP,\n  cert_agreement = $2\nWHERE id = $1',
}

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
 *   cert_agreement = $2
 * WHERE id = $1
 * ```
 */
export const updateCertAgreement = new PreparedQuery<
  IUpdateCertAgreementParams,
  IUpdateCertAgreementResult
>(updateCertAgreementIR)
