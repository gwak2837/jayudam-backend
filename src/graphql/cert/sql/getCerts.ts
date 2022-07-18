/** Types generated for queries found in "src/graphql/cert/sql/getCerts.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetCerts' parameters type */
export type IGetCertsParams = void;

/** 'GetCerts' return type */
export interface IGetCertsResult {
  birthdate: Date;
  content: string;
  effective_date: Date;
  id: string;
  issue_date: Date;
  name: string;
  sex: number;
  type: number;
}

/** 'GetCerts' query type */
export interface IGetCertsQuery {
  params: IGetCertsParams;
  result: IGetCertsResult;
}

const getCertsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  birthdate,\n  content,\n  effective_date,\n  issue_date,\n  name,\n  sex,\n  \"type\"\nFROM cert\nWHERE user_id = $1\n  AND \"type\" = ANY ($2)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   birthdate,
 *   content,
 *   effective_date,
 *   issue_date,
 *   name,
 *   sex,
 *   "type"
 * FROM cert
 * WHERE user_id = $1
 *   AND "type" = ANY ($2)
 * ```
 */
export const getCerts = new PreparedQuery<IGetCertsParams,IGetCertsResult>(getCertsIR);


