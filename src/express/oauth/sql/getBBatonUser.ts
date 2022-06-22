/** Types generated for queries found in "src/express/oauth/sql/getBBatonUser.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetBBatonUser' parameters type */
export type IGetBBatonUserParams = void

/** 'GetBBatonUser' return type */
export interface IGetBBatonUserResult {
  id: string
  nickname: string | null
}

/** 'GetBBatonUser' query type */
export interface IGetBBatonUserQuery {
  params: IGetBBatonUserParams
  result: IGetBBatonUserResult
}

const getBBatonUserIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT id,\n  nickname\nFROM "user"\nWHERE bbaton_oauth = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   nickname
 * FROM "user"
 * WHERE bbaton_oauth = $1
 * ```
 */
export const getBBatonUser = new PreparedQuery<IGetBBatonUserParams, IGetBBatonUserResult>(
  getBBatonUserIR
)
