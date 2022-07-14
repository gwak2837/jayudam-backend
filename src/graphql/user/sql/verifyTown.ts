/** Types generated for queries found in "src/graphql/user/sql/verifyTown.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'VerifyTown' parameters type */
export type IVerifyTownParams = void;

/** 'VerifyTown' return type */
export interface IVerifyTownResult {
  town1_count: number;
  town1_name: string | null;
  town2_count: number;
  town2_name: string | null;
}

/** 'VerifyTown' query type */
export interface IVerifyTownQuery {
  params: IVerifyTownParams;
  result: IVerifyTownResult;
}

const verifyTownIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET town1_count = CASE\n    WHEN $2 = town1_name THEN town1_count + 1\n    ELSE town1_count\n  END,\n  town2_count = CASE\n    WHEN $2 = town2_name THEN town2_count + 1\n    ELSE town2_count\n  END\nWHERE id = $1\nRETURNING town1_count,\n  town1_name,\n  town2_count,\n  town2_name"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET town1_count = CASE
 *     WHEN $2 = town1_name THEN town1_count + 1
 *     ELSE town1_count
 *   END,
 *   town2_count = CASE
 *     WHEN $2 = town2_name THEN town2_count + 1
 *     ELSE town2_count
 *   END
 * WHERE id = $1
 * RETURNING town1_count,
 *   town1_name,
 *   town2_count,
 *   town2_name
 * ```
 */
export const verifyTown = new PreparedQuery<IVerifyTownParams,IVerifyTownResult>(verifyTownIR);


