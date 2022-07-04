/** Types generated for queries found in "src/graphql/user/sql/me.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'Me' parameters type */
export type IMeParams = void;

/** 'Me' return type */
export interface IMeResult {
  id: string;
  nickname: string | null;
}

/** 'Me' query type */
export interface IMeQuery {
  params: IMeParams;
  result: IMeResult;
}

const meIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname\nFROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const me = new PreparedQuery<IMeParams,IMeResult>(meIR);


