/** Types generated for queries found in "src/graphql/user/sql/getSleepingUserInfo.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type numberArray = (number)[];

export type stringArray = (string)[];

/** 'GetSleepingUserInfo' parameters type */
export type IGetSleepingUserInfoParams = void;

/** 'GetSleepingUserInfo' return type */
export interface IGetSleepingUserInfoResult {
  bio: string | null;
  birthday: string | null;
  birthyear: string | null;
  image_urls: stringArray | null;
  is_verified_birthday: boolean;
  is_verified_birthyear: boolean;
  is_verified_email: boolean;
  is_verified_name: boolean;
  is_verified_phone_number: boolean;
  is_verified_sex: boolean;
  locations: stringArray | null;
  locations_verification_count: numberArray | null;
  name: string | null;
  sex: number | null;
}

/** 'GetSleepingUserInfo' query type */
export interface IGetSleepingUserInfoQuery {
  params: IGetSleepingUserInfoParams;
  result: IGetSleepingUserInfoResult;
}

const getSleepingUserInfoIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT bio,\n  birthyear,\n  birthday,\n  image_urls,\n  is_verified_birthyear,\n  is_verified_birthday,\n  is_verified_email,\n  is_verified_name,\n  is_verified_phone_number,\n  is_verified_sex,\n  locations,\n  locations_verification_count,\n  name,\n  sex\nFROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT bio,
 *   birthyear,
 *   birthday,
 *   image_urls,
 *   is_verified_birthyear,
 *   is_verified_birthday,
 *   is_verified_email,
 *   is_verified_name,
 *   is_verified_phone_number,
 *   is_verified_sex,
 *   locations,
 *   locations_verification_count,
 *   name,
 *   sex
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const getSleepingUserInfo = new PreparedQuery<IGetSleepingUserInfoParams,IGetSleepingUserInfoResult>(getSleepingUserInfoIR);


