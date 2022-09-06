/** Types generated for queries found in "src/express/oauth/sql/getUser.sql" */
import { PreparedQuery } from '@pgtyped/query'

export type stringArray = string[]

/** 'GetUser' parameters type */
export type IGetUserParams = void

/** 'GetUser' return type */
export interface IGetUserResult {
  birthday: string | null
  birthyear: number | null
  email: string | null
  id: string
  image_urls: stringArray | null
  legal_name: string | null
  name: string | null
  oauth_google: string | null
  oauth_kakao: string | null
  oauth_naver: string | null
  phone_number: string | null
  sex: number | null
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams
  result: IGetUserResult
}

const getUserIR: any = {
  usedParamSet: {},
  params: [],
  statement:
    'SELECT id,\n  birthyear,\n  birthday,\n  email,\n  image_urls,\n  legal_name,\n  name,\n  oauth_google,\n  oauth_kakao,\n  oauth_naver,\n  phone_number,\n  sex\nFROM "user"\nWHERE id = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   birthyear,
 *   birthday,
 *   email,
 *   image_urls,
 *   legal_name,
 *   name,
 *   oauth_google,
 *   oauth_kakao,
 *   oauth_naver,
 *   phone_number,
 *   sex
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const getUser = new PreparedQuery<IGetUserParams, IGetUserResult>(getUserIR)
