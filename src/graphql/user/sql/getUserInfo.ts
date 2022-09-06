/** Types generated for queries found in "src/graphql/user/sql/getUserInfo.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetUserInfo' parameters type */
export type IGetUserInfoParams = void

/** 'GetUserInfo' return type */
export interface IGetUserInfoResult {
  blocking_end_time: Date | null
  oauth_bbaton: string
  oauth_google: string | null
  oauth_kakao: string | null
  oauth_naver: string | null
}

/** 'GetUserInfo' query type */
export interface IGetUserInfoQuery {
  params: IGetUserInfoParams
  result: IGetUserInfoResult
}

const getUserInfoIR: any = {
  usedParamSet: {},
  params: [],
  statement:
    'SELECT blocking_end_time,\n  oauth_kakao,\n  oauth_naver,\n  oauth_google,\n  oauth_bbaton\nFROM "user"\nWHERE id = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT blocking_end_time,
 *   oauth_kakao,
 *   oauth_naver,
 *   oauth_google,
 *   oauth_bbaton
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const getUserInfo = new PreparedQuery<IGetUserInfoParams, IGetUserInfoResult>(getUserInfoIR)
