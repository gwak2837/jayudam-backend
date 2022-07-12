/** Types generated for queries found in "src/graphql/certificate/sql/getCertificates.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetCertificates' parameters type */
export type IGetCertificatesParams = void;

/** 'GetCertificates' return type */
export interface IGetCertificatesResult {
  birth_date: Date;
  content: string;
  effective_date: Date;
  id: string;
  issue_date: Date;
  name: string;
  sex: number;
  type: number;
}

/** 'GetCertificates' query type */
export interface IGetCertificatesQuery {
  params: IGetCertificatesParams;
  result: IGetCertificatesResult;
}

const getCertificatesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  birth_date,\n  content,\n  effective_date,\n  issue_date,\n  name,\n  sex,\n  \"type\"\nFROM certificate\nWHERE user_id = $1\n  AND \"type\" = ANY ($2)\n  AND effective_date > $3"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   birth_date,
 *   content,
 *   effective_date,
 *   issue_date,
 *   name,
 *   sex,
 *   "type"
 * FROM certificate
 * WHERE user_id = $1
 *   AND "type" = ANY ($2)
 *   AND effective_date > $3
 * ```
 */
export const getCertificates = new PreparedQuery<IGetCertificatesParams,IGetCertificatesResult>(getCertificatesIR);


