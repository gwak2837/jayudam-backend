/** Types generated for queries found in "src/express/oauth/sql/findKakaoUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindKakaoUser' parameters type */
export type IFindKakaoUserParams = void;

/** 'FindKakaoUser' return type */
export interface IFindKakaoUserResult {
  id: string;
  nickname: string | null;
  phone_number: string | null;
}

/** 'FindKakaoUser' query type */
export interface IFindKakaoUserQuery {
  params: IFindKakaoUserParams;
  result: IFindKakaoUserResult;
}

const findKakaoUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  nickname,\n  phone_number\nFROM \"user\"\nWHERE kakao_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname,
 *   phone_number
 * FROM "user"
 * WHERE kakao_oauth = $1
 * ```
 */
export const findKakaoUser = new PreparedQuery<IFindKakaoUserParams,IFindKakaoUserResult>(findKakaoUserIR);


