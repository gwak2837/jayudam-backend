/** Types generated for queries found in "src/graphql/user/sql/myProfile.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'MyProfile' parameters type */
export type IMyProfileParams = void;

/** 'MyProfile' return type */
export interface IMyProfileResult {
  id: string;
  image_urls: string | null;
}

/** 'MyProfile' query type */
export interface IMyProfileQuery {
  params: IMyProfileParams;
  result: IMyProfileResult;
}

const myProfileIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  image_urls [1]\nFROM \"user\"\nWHERE \"user\".id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   image_urls [1]
 * FROM "user"
 * WHERE "user".id = $1
 * ```
 */
export const myProfile = new PreparedQuery<IMyProfileParams,IMyProfileResult>(myProfileIR);


