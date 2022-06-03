/** Types generated for queries found in "src/graphql/user/sql/getUserKakaoId.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetUserKakaoId' parameters type */
export type IGetUserKakaoIdParams = void;

/** 'GetUserKakaoId' return type */
export interface IGetUserKakaoIdResult {
  kakaoOauth: string | null;
}

/** 'GetUserKakaoId' query type */
export interface IGetUserKakaoIdQuery {
  params: IGetUserKakaoIdParams;
  result: IGetUserKakaoIdResult;
}

const getUserKakaoIdIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT kakao_oauth\nFROM \"user\"\nWHERE id = $1\n  AND nickname = $2"};

/**
 * Query generated from SQL:
 * ```
 * SELECT kakao_oauth
 * FROM "user"
 * WHERE id = $1
 *   AND nickname = $2
 * ```
 */
export const getUserKakaoId = new PreparedQuery<IGetUserKakaoIdParams,IGetUserKakaoIdResult>(getUserKakaoIdIR);


