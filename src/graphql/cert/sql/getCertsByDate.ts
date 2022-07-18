/** Types generated for queries found in "src/graphql/cert/sql/getCertsByDate.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'GetCerts' is invalid, so its result is assigned type 'never' */
export type IGetCertsResult = never;

/** Query 'GetCerts' is invalid, so its parameters are assigned type 'never' */
export type IGetCertsParams = never;

const getCertsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  birth_date,\n  content,\n  effective_date,\n  issue_date,\n  name,\n  sex,\n  \"type\"\nFROM cert\nWHERE user_id = $1\n  AND \"type\" = ANY ($2)\n  AND effective_date > $3"};

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
 * FROM cert
 * WHERE user_id = $1
 *   AND "type" = ANY ($2)
 *   AND effective_date > $3
 * ```
 */
export const getCerts = new PreparedQuery<IGetCertsParams,IGetCertsResult>(getCertsIR);


