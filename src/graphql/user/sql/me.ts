/** Types generated for queries found in "src/graphql/user/sql/me.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'Me' parameters type */
export type IMeParams = void;

/** 'Me' return type */
export interface IMeResult {
  bio: string | null;
  birthday: string | null;
  birthyear: number | null;
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  cherry: number;
  cover_image_urls: stringArray | null;
  creation_time: Date | null;
  follower_count: string | null;
  following_count: string | null;
  grade: number | null;
  id: string;
  image_urls: stringArray | null;
  is_private: boolean;
  is_verified_birthday: boolean;
  is_verified_birthyear: boolean;
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

/** 'Me' query type */
export interface IMeQuery {
  params: IMeParams;
  result: IMeResult;
}

const meIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT \"user\".id,\n  \"user\".creation_time,\n  bio,\n  birthday,\n  birthyear,\n  blocking_start_time,\n  blocking_end_time,\n  cover_image_urls,\n  cherry,\n  grade,\n  \"user\".image_urls,\n  is_private,\n  is_verified_birthday,\n  is_verified_birthyear,\n  is_verified_sex,\n  name,\n  nickname,\n  sex,\n  sleeping_time,\n  town1_count,\n  town1_name,\n  town2_count,\n  town2_name,\n  COUNT(post.id) AS post_count,\n  COUNT(follower.leader_id) AS follower_count,\n  COUNT(\"following\".follower_id) AS following_count\nFROM \"user\"\n  LEFT JOIN post ON post.user_id = \"user\".id\n  LEFT JOIN user_x_user AS follower ON follower.leader_id = \"user\".id\n  LEFT JOIN user_x_user AS \"following\" ON \"following\".follower_id = \"user\".id\nWHERE \"user\".id = $1\nGROUP BY \"user\".id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "user".id,
 *   "user".creation_time,
 *   bio,
 *   birthday,
 *   birthyear,
 *   blocking_start_time,
 *   blocking_end_time,
 *   cover_image_urls,
 *   cherry,
 *   grade,
 *   "user".image_urls,
 *   is_private,
 *   is_verified_birthday,
 *   is_verified_birthyear,
 *   is_verified_sex,
 *   name,
 *   nickname,
 *   sex,
 *   sleeping_time,
 *   town1_count,
 *   town1_name,
 *   town2_count,
 *   town2_name,
 *   COUNT(post.id) AS post_count,
 *   COUNT(follower.leader_id) AS follower_count,
 *   COUNT("following".follower_id) AS following_count
 * FROM "user"
 *   LEFT JOIN post ON post.user_id = "user".id
 *   LEFT JOIN user_x_user AS follower ON follower.leader_id = "user".id
 *   LEFT JOIN user_x_user AS "following" ON "following".follower_id = "user".id
 * WHERE "user".id = $1
 * GROUP BY "user".id
 * ```
 */
export const me = new PreparedQuery<IMeParams,IMeResult>(meIR);


