/** Types generated for queries found in "src/routes/push/sql/myLeaderIds.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'MyLeaderIds' parameters type */
export type IMyLeaderIdsParams = void;

/** 'MyLeaderIds' return type */
export interface IMyLeaderIdsResult {
  leader_id: string;
}

/** 'MyLeaderIds' query type */
export interface IMyLeaderIdsQuery {
  params: IMyLeaderIdsParams;
  result: IMyLeaderIdsResult;
}

const myLeaderIdsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT leader_id\nFROM user_x_user\nWHERE follower_id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT leader_id
 * FROM user_x_user
 * WHERE follower_id = $1
 * ```
 */
export const myLeaderIds = new PreparedQuery<IMyLeaderIdsParams,IMyLeaderIdsResult>(myLeaderIdsIR);


