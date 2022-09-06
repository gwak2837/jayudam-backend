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
  creation_time: Date | null;
  grade: number | null;
  id: string;
  image_urls: stringArray | null;
  is_private: boolean;
  is_verified_sex: boolean;
  name: string | null;
  nickname: string | null;
  post_count: string | null;
  sex: number | null;
  sleeping_time: Date | null;
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

const userByNameIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT \"user\".id,\n  \"user\".creation_time,\n  bio,\n  blocking_start_time,\n  blocking_end_time,\n  grade,\n  \"user\".image_urls,\n  is_private,\n  is_verified_sex,\n  name,\n  nickname,\n  sex,\n  sleeping_time,\n  town1_count,\n  town1_name,\n  town2_count,\n  town2_name,\n  COUNT(post.id) AS post_count\nFROM \"user\"\n  LEFT JOIN post ON post.user_id = \"user\".id\nWHERE name = $1\nGROUP BY \"user\".id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "user".id,
 *   "user".creation_time,
 *   bio,
 *   blocking_start_time,
 *   blocking_end_time,
 *   grade,
 *   "user".image_urls,
 *   is_private,
 *   is_verified_sex,
 *   name,
 *   nickname,
 *   sex,
 *   sleeping_time,
 *   town1_count,
 *   town1_name,
 *   town2_count,
 *   town2_name,
 *   COUNT(post.id) AS post_count
 * FROM "user"
 *   LEFT JOIN post ON post.user_id = "user".id
 * WHERE name = $1
 * GROUP BY "user".id
 * ```
 */
export const userByName = new PreparedQuery<IUserByNameParams,IUserByNameResult>(userByNameIR);


