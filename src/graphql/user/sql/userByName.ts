/** Types generated for queries found in "src/graphql/user/sql/userByName.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'UserByName' parameters type */
export type IUserByNameParams = void;

/** 'UserByName' return type */
export interface IUserByNameResult {
  bio: string | null;
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  grade: number | null;
  image_urls: stringArray | null;
  is_verified_sex: boolean;
  name: string | null;
  nickname: string | null;
  sex: number | null;
  town1_count: number;
  town1_name: string | null;
  town2_count: number;
  town2_name: string | null;
}

/** 'UserByName' query type */
export interface IUserByNameQuery {
  params: IUserByNameParams;
  result: IUserByNameResult;
}

const userByNameIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT bio,\n  blocking_start_time,\n  blocking_end_time,\n  grade,\n  image_urls,\n  is_verified_sex,\n  name,\n  nickname,\n  sex,\n  town1_count,\n  town1_name,\n  town2_count,\n  town2_name\nFROM \"user\"\nWHERE name = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT bio,
 *   blocking_start_time,
 *   blocking_end_time,
 *   grade,
 *   image_urls,
 *   is_verified_sex,
 *   name,
 *   nickname,
 *   sex,
 *   town1_count,
 *   town1_name,
 *   town2_count,
 *   town2_name
 * FROM "user"
 * WHERE name = $1
 * ```
 */
export const userByName = new PreparedQuery<IUserByNameParams,IUserByNameResult>(userByNameIR);


