/** Types generated for queries found in "src/graphql/user/sql/me.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'Me' parameters type */
export type IMeParams = void;

/** 'Me' return type */
export interface IMeResult {
  bio: string | null;
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  cherry: number;
  grade: number | null;
  id: string;
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

/** 'Me' query type */
export interface IMeQuery {
  params: IMeParams;
  result: IMeResult;
}

const meIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  bio,\n  blocking_start_time,\n  blocking_end_time,\n  cherry,\n  grade,\n  image_urls,\n  is_verified_sex,\n  name,\n  nickname,\n  sex,\n  town1_count,\n  town1_name,\n  town2_count,\n  town2_name\nFROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   bio,
 *   blocking_start_time,
 *   blocking_end_time,
 *   cherry,
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
 * WHERE id = $1
 * ```
 */
export const me = new PreparedQuery<IMeParams,IMeResult>(meIR);


