/** Types generated for queries found in "src/graphql/user/sql/putUserToSleep.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type numberArray = (number)[];

export type stringArray = (string)[];

/** 'PutUserToSleep' parameters type */
export type IPutUserToSleepParams = void;

/** 'PutUserToSleep' return type */
export interface IPutUserToSleepResult {
  bio: string | null;
  birthday: string | null;
  birthyear: string | null;
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  creation_time: Date | null;
  deactivation_time: Date | null;
  email: string | null;
  grade: number;
  id: string;
  image_urls: stringArray | null;
  is_verified_birthday: boolean;
  is_verified_birthyear: boolean;
  is_verified_email: boolean;
  is_verified_name: boolean;
  is_verified_phone_number: boolean;
  is_verified_sex: boolean;
  locations: stringArray | null;
  locations_verification_count: numberArray | null;
  modification_time: Date | null;
  name: string | null;
  nickname: string | null;
  oauth_bbaton: string;
  oauth_google: string | null;
  oauth_kakao: string | null;
  oauth_naver: string | null;
  personal_data_storing_period: number;
  phone_number: string | null;
  sex: number | null;
  sleeping_time: Date | null;
  verification_monthly_spending_limit: number;
}

/** 'PutUserToSleep' query type */
export interface IPutUserToSleepQuery {
  params: IPutUserToSleepParams;
  result: IPutUserToSleepResult;
}

const putUserToSleepIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET modification_time = CURRENT_TIMESTAMP,\n  bio = NULL,\n  birthyear = NULL,\n  birthday = NULL,\n  image_urls = NULL,\n  is_verified_birthyear = FALSE,\n  is_verified_birthday = FALSE,\n  is_verified_email = FALSE,\n  is_verified_name = FALSE,\n  is_verified_phone_number = FALSE,\n  is_verified_sex = FALSE,\n  locations = NULL,\n  locations_verification_count = NULL,\n  name = NULL,\n  sex = NULL,\n  sleeping_time = CURRENT_TIMESTAMP\nWHERE id = $1\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET modification_time = CURRENT_TIMESTAMP,
 *   bio = NULL,
 *   birthyear = NULL,
 *   birthday = NULL,
 *   image_urls = NULL,
 *   is_verified_birthyear = FALSE,
 *   is_verified_birthday = FALSE,
 *   is_verified_email = FALSE,
 *   is_verified_name = FALSE,
 *   is_verified_phone_number = FALSE,
 *   is_verified_sex = FALSE,
 *   locations = NULL,
 *   locations_verification_count = NULL,
 *   name = NULL,
 *   sex = NULL,
 *   sleeping_time = CURRENT_TIMESTAMP
 * WHERE id = $1
 * RETURNING *
 * ```
 */
export const putUserToSleep = new PreparedQuery<IPutUserToSleepParams,IPutUserToSleepResult>(putUserToSleepIR);


