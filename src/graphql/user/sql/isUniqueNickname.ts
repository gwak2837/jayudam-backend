/** Types generated for queries found in "src/graphql/user/sql/isUniqueNickname.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'IsUniqueNickname' parameters type */
export type IIsUniqueNicknameParams = void;

/** 'IsUniqueNickname' return type */
export interface IIsUniqueNicknameResult {
  nickname: string | null;
}

/** 'IsUniqueNickname' query type */
export interface IIsUniqueNicknameQuery {
  params: IIsUniqueNicknameParams;
  result: IIsUniqueNicknameResult;
}

const isUniqueNicknameIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT nickname\nFROM \"user\"\nWHERE nickname = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT nickname
 * FROM "user"
 * WHERE nickname = $1
 * ```
 */
export const isUniqueNickname = new PreparedQuery<IIsUniqueNicknameParams,IIsUniqueNicknameResult>(isUniqueNicknameIR);


