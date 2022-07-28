/** Types generated for queries found in "src/graphql/user/sql/userByNickname.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'UserByNickname' parameters type */
export type IUserByNicknameParams = void;

/** 'UserByNickname' return type */
export interface IUserByNicknameResult {
  bio: string | null;
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  grade: number | null;
  image_urls: stringArray | null;
  is_verified_sex: boolean;
  nickname: string | null;
  sex: number | null;
  town1_count: number;
  town1_name: string | null;
  town2_count: number;
  town2_name: string | null;
}

/** 'UserByNickname' query type */
export interface IUserByNicknameQuery {
  params: IUserByNicknameParams;
  result: IUserByNicknameResult;
}

const userByNicknameIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT bio,\n  blocking_start_time,\n  blocking_end_time,\n  grade,\n  image_urls,\n  is_verified_sex,\n  nickname,\n  sex,\n  town1_count,\n  town1_name,\n  town2_count,\n  town2_name\nFROM \"user\"\nWHERE nickname = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT bio,
 *   blocking_start_time,
 *   blocking_end_time,
 *   grade,
 *   image_urls,
 *   is_verified_sex,
 *   nickname,
 *   sex,
 *   town1_count,
 *   town1_name,
 *   town2_count,
 *   town2_name
 * FROM "user"
 * WHERE nickname = $1
 * ```
 */
export const userByNickname = new PreparedQuery<IUserByNicknameParams,IUserByNicknameResult>(userByNicknameIR);


