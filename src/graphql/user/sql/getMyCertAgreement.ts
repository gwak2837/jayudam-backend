/** Types generated for queries found in "src/graphql/user/sql/getMyCertAgreement.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetMyCertAgreement' parameters type */
export type IGetMyCertAgreementParams = void;

/** 'GetMyCertAgreement' return type */
export interface IGetMyCertAgreementResult {
  cert_agreement: string | null;
  cherry: number;
}

/** 'GetMyCertAgreement' query type */
export interface IGetMyCertAgreementQuery {
  params: IGetMyCertAgreementParams;
  result: IGetMyCertAgreementResult;
}

const getMyCertAgreementIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT cert_agreement,\n  cherry\nFROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT cert_agreement,
 *   cherry
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const getMyCertAgreement = new PreparedQuery<IGetMyCertAgreementParams,IGetMyCertAgreementResult>(getMyCertAgreementIR);


