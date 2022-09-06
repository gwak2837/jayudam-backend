/** Types generated for queries found in "src/graphql/user/sql/isUniqueUsername.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'IsUniqueUsername' parameters type */
export type IIsUniqueUsernameParams = void;

/** 'IsUniqueUsername' return type */
export interface IIsUniqueUsernameResult {
  nickname: string | null;
}

/** 'IsUniqueUsername' query type */
export interface IIsUniqueUsernameQuery {
  params: IIsUniqueUsernameParams;
  result: IIsUniqueUsernameResult;
}

const isUniqueUsernameIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT nickname\nFROM \"user\"\nWHERE nickname = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT nickname
 * FROM "user"
 * WHERE nickname = $1
 * ```
 */
export const isUniqueUsername = new PreparedQuery<IIsUniqueUsernameParams,IIsUniqueUsernameResult>(isUniqueUsernameIR);


