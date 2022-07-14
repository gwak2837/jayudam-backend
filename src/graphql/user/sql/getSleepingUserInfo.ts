/** Types generated for queries found in "src/graphql/user/sql/getSleepingUserInfo.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'GetSleepingUserInfo' is invalid, so its result is assigned type 'never' */
export type IGetSleepingUserInfoResult = never;

/** Query 'GetSleepingUserInfo' is invalid, so its parameters are assigned type 'never' */
export type IGetSleepingUserInfoParams = never;

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


