/** Types generated for queries found in "src/graphql/user/sql/putUserToSleep.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'PutUserToSleep' is invalid, so its result is assigned type 'never' */
export type IPutUserToSleepResult = never;

/** Query 'PutUserToSleep' is invalid, so its parameters are assigned type 'never' */
export type IPutUserToSleepParams = never;

const putUserToSleepIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  bio = NULL,\n  birthyear = NULL,\n  birthday = NULL,\n  image_urls = NULL,\n  is_verified_birthyear = FALSE,\n  is_verified_birthday = FALSE,\n  is_verified_email = FALSE,\n  is_verified_name = FALSE,\n  is_verified_phone_number = FALSE,\n  is_verified_sex = FALSE,\n  locations = NULL,\n  locations_verification_count = NULL,\n  name = NULL,\n  sex = NULL,\n  sleeping_time = CURRENT_TIMESTAMP\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
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
 * ```
 */
export const putUserToSleep = new PreparedQuery<IPutUserToSleepParams,IPutUserToSleepResult>(putUserToSleepIR);


