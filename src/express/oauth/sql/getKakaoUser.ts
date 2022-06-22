/** Types generated for queries found in "src/express/oauth/sql/getKakaoUser.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetKakaoUser' parameters type */
export type IGetKakaoUserParams = void

/** 'GetKakaoUser' return type */
export interface IGetKakaoUserResult {
  id: string
  nickname: string | null
}

/** 'GetKakaoUser' query type */
export interface IGetKakaoUserQuery {
  params: IGetKakaoUserParams
  result: IGetKakaoUserResult
}

const getKakaoUserIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT id,\n  nickname\nFROM "user"\nWHERE kakao_oauth = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname
 * FROM "user"
 * WHERE kakao_oauth = $1
 * ```
 */
export const getKakaoUser = new PreparedQuery<IGetKakaoUserParams, IGetKakaoUserResult>(
  getKakaoUserIR
)
