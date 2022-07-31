/** Types generated for queries found in "src/express/oauth/sql/getGoogleUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetGoogleUser' parameters type */
export type IGetGoogleUserParams = void;

/** 'GetGoogleUser' return type */
export interface IGetGoogleUserResult {
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  id: string;
  legal_name: string | null;
  name: string | null;
  sleeping_time: Date | null;
}

/** 'GetGoogleUser' query type */
export interface IGetGoogleUserQuery {
  params: IGetGoogleUserParams;
  result: IGetGoogleUserResult;
}

const getGoogleUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  blocking_start_time,\n  blocking_end_time,\n  legal_name,\n  name,\n  sleeping_time\nFROM \"user\"\nWHERE oauth_google = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   blocking_start_time,
 *   blocking_end_time,
 *   legal_name,
 *   name,
 *   sleeping_time
 * FROM "user"
 * WHERE oauth_google = $1
 * ```
 */
export const getGoogleUser = new PreparedQuery<IGetGoogleUserParams,IGetGoogleUserResult>(getGoogleUserIR);


