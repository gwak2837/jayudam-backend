/** Types generated for queries found in "src/express/oauth/sql/getGoogleUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetGoogleUser' parameters type */
export type IGetGoogleUserParams = void;

/** 'GetGoogleUser' return type */
export interface IGetGoogleUserResult {
  id: string;
  name: string | null;
  nickname: string | null;
}

/** 'GetGoogleUser' query type */
export interface IGetGoogleUserQuery {
  params: IGetGoogleUserParams;
  result: IGetGoogleUserResult;
}

const getGoogleUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname,\n  name\nFROM \"user\"\nWHERE google_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname,
 *   name
 * FROM "user"
 * WHERE google_oauth = $1
 * ```
 */
export const getGoogleUser = new PreparedQuery<IGetGoogleUserParams,IGetGoogleUserResult>(getGoogleUserIR);


