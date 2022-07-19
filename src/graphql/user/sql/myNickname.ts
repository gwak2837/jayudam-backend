/** Types generated for queries found in "src/graphql/user/sql/myNickname.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'MyNickname' parameters type */
export type IMyNicknameParams = void;

/** 'MyNickname' return type */
export interface IMyNicknameResult {
  id: string;
  nickname: string | null;
}

/** 'MyNickname' query type */
export interface IMyNicknameQuery {
  params: IMyNicknameParams;
  result: IMyNicknameResult;
}

const myNicknameIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname\nFROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const myNickname = new PreparedQuery<IMyNicknameParams,IMyNicknameResult>(myNicknameIR);


