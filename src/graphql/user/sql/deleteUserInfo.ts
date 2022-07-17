/** Types generated for queries found in "src/graphql/user/sql/deleteUserInfo.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'DeleteUserInfo' parameters type */
export type IDeleteUserInfoParams = void;

/** 'DeleteUserInfo' return type */
export interface IDeleteUserInfoResult {
  blocking_start_time: Date | null;
}

/** 'DeleteUserInfo' query type */
export interface IDeleteUserInfoQuery {
  params: IDeleteUserInfoParams;
  result: IDeleteUserInfoResult;
}

const deleteUserInfoIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET creation_time = NULL,\n  update_time = NULL,\n  bio = NULL,\n  birthyear = NULL,\n  birthday = NULL,\n  cert_agreement = NULL,\n  cherry = 0,\n  deactivation_time = NULL,\n  email = NULL,\n  grade = NULL,\n  image_urls = NULL,\n  invitation_code = NULL,\n  is_verified_birthyear = FALSE,\n  is_verified_birthday = FALSE,\n  is_verified_email = FALSE,\n  is_verified_name = FALSE,\n  is_verified_phone_number = FALSE,\n  last_attendance = NULL,\n  name = NULL,\n  nickname = NULL,\n  personal_data_storing_year = 1,\n  phone_number = NULL,\n  sex = NULL,\n  sleeping_time = NULL,\n  town1_count = 0,\n  town1_name = NULL,\n  town2_count = 0,\n  town2_name = NULL\nWHERE id = $1\nRETURNING blocking_start_time"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET creation_time = NULL,
 *   update_time = NULL,
 *   bio = NULL,
 *   birthyear = NULL,
 *   birthday = NULL,
 *   cert_agreement = NULL,
 *   cherry = 0,
 *   deactivation_time = NULL,
 *   email = NULL,
 *   grade = NULL,
 *   image_urls = NULL,
 *   invitation_code = NULL,
 *   is_verified_birthyear = FALSE,
 *   is_verified_birthday = FALSE,
 *   is_verified_email = FALSE,
 *   is_verified_name = FALSE,
 *   is_verified_phone_number = FALSE,
 *   last_attendance = NULL,
 *   name = NULL,
 *   nickname = NULL,
 *   personal_data_storing_year = 1,
 *   phone_number = NULL,
 *   sex = NULL,
 *   sleeping_time = NULL,
 *   town1_count = 0,
 *   town1_name = NULL,
 *   town2_count = 0,
 *   town2_name = NULL
 * WHERE id = $1
 * RETURNING blocking_start_time
 * ```
 */
export const deleteUserInfo = new PreparedQuery<IDeleteUserInfoParams,IDeleteUserInfoResult>(deleteUserInfoIR);


