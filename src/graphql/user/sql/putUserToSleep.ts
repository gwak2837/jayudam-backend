/** Types generated for queries found in "src/graphql/user/sql/putUserToSleep.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'PutUserToSleep' parameters type */
export type IPutUserToSleepParams = void;

/** 'PutUserToSleep' return type */
export type IPutUserToSleepResult = void;

/** 'PutUserToSleep' query type */
export interface IPutUserToSleepQuery {
  params: IPutUserToSleepParams;
  result: IPutUserToSleepResult;
}

const putUserToSleepIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  bio = NULL,\n  birthyear = NULL,\n  birthday = NULL,\n  image_urls = NULL,\n  is_verified_birthyear = FALSE,\n  is_verified_birthday = FALSE,\n  is_verified_email = FALSE,\n  is_verified_legal_name = FALSE,\n  is_verified_phone_number = FALSE,\n  is_verified_sex = FALSE,\n  name = NULL,\n  sex = NULL,\n  sleeping_time = CURRENT_TIMESTAMP,\n  town1_count = 0,\n  town1_name = NULL,\n  town2_count = 0,\n  town2_name = NULL\nWHERE id = $1"};

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
 *   is_verified_legal_name = FALSE,
 *   is_verified_phone_number = FALSE,
 *   is_verified_sex = FALSE,
 *   name = NULL,
 *   sex = NULL,
 *   sleeping_time = CURRENT_TIMESTAMP,
 *   town1_count = 0,
 *   town1_name = NULL,
 *   town2_count = 0,
 *   town2_name = NULL
 * WHERE id = $1
 * ```
 */
export const putUserToSleep = new PreparedQuery<IPutUserToSleepParams,IPutUserToSleepResult>(putUserToSleepIR);


