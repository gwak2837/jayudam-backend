/** Types generated for queries found in "src/graphql/user/sql/deleteUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'DeleteUser' parameters type */
export type IDeleteUserParams = void;

/** 'DeleteUser' return type */
export type IDeleteUserResult = void;

/** 'DeleteUser' query type */
export interface IDeleteUserQuery {
  params: IDeleteUserParams;
  result: IDeleteUserResult;
}

const deleteUserIR: any = {"usedParamSet":{},"params":[],"statement":"DELETE FROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM "user"
 * WHERE id = $1
 * ```
 */
export const deleteUser = new PreparedQuery<IDeleteUserParams,IDeleteUserResult>(deleteUserIR);


