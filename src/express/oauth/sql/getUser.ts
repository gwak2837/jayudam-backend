/** Types generated for queries found in "src/express/oauth/sql/getUser.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'GetUser' parameters type */
export type IGetUserParams = void

/** 'GetUser' return type */
export interface IGetUserResult {
  email: string | null
  id: string
  name: string | null
}

/** 'GetUser' query type */
export interface IGetUserQuery {
  params: IGetUserParams
  result: IGetUserResult
}

const getUserIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT id,\n  email,\n  name\nFROM "user"\nWHERE id = $1',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   email,
 *   name
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const getUser = new PreparedQuery<IGetUserParams, IGetUserResult>(getUserIR)
