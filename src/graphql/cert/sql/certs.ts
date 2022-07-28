/** Types generated for queries found in "src/graphql/cert/sql/certs.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Certs' parameters type */
export type ICertsParams = void;

/** 'Certs' return type */
export interface ICertsResult {
  birthdate: Date;
  cert_name: string;
  content: string;
  effective_date: Date;
  id: string;
  issue_date: Date;
  location: string;
  name: string;
  sex: number;
  type: number;
}

/** 'Certs' query type */
export interface ICertsQuery {
  params: ICertsParams;
  result: ICertsResult;
}

const certsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  birthdate,\n  cert_name,\n  content,\n  effective_date,\n  issue_date,\n  location,\n  name,\n  sex,\n  \"type\"\nFROM cert\nWHERE user_id = $1\n  AND \"type\" = ANY ($2)\n  AND (\n    (\n      \"type\" = 0\n      OR \"type\" = 1\n    )\n    AND effective_date > $3\n    OR \"type\" = 2\n    AND effective_date > $4\n    OR \"type\" = 3\n    AND effective_date > $5\n  )\nORDER BY effective_date DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   birthdate,
 *   cert_name,
 *   content,
 *   effective_date,
 *   issue_date,
 *   location,
 *   name,
 *   sex,
 *   "type"
 * FROM cert
 * WHERE user_id = $1
 *   AND "type" = ANY ($2)
 *   AND (
 *     (
 *       "type" = 0
 *       OR "type" = 1
 *     )
 *     AND effective_date > $3
 *     OR "type" = 2
 *     AND effective_date > $4
 *     OR "type" = 3
 *     AND effective_date > $5
 *   )
 * ORDER BY effective_date DESC
 * ```
 */
export const certs = new PreparedQuery<ICertsParams,ICertsResult>(certsIR);


