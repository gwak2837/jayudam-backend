/** Types generated for queries found in "src/graphql/user/sql/getUserKakaoId.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetUserKakaoId' parameters type */
export type IGetUserKakaoIdParams = void;

/** 'GetUserKakaoId' return type */
export interface IGetUserKakaoIdResult {
  oauth_kakao: string | null;
}

/** 'GetUserKakaoId' query type */
export interface IGetUserKakaoIdQuery {
  params: IGetUserKakaoIdParams;
  result: IGetUserKakaoIdResult;
}

const getUserKakaoIdIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT oauth_kakao\nFROM \"user\"\nWHERE id = $1\n  AND nickname = $2"};

/**
 * Query generated from SQL:
 * ```
 * SELECT oauth_kakao
 * FROM "user"
 * WHERE id = $1
 *   AND nickname = $2
 * ```
 */
export const getUserKakaoId = new PreparedQuery<IGetUserKakaoIdParams,IGetUserKakaoIdResult>(getUserKakaoIdIR);


