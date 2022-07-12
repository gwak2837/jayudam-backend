/** Types generated for queries found in "src/graphql/user/sql/updateUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'UpdateUser' is invalid, so its result is assigned type 'never' */
export type IUpdateUserResult = never;

/** Query 'UpdateUser' is invalid, so its parameters are assigned type 'never' */
export type IUpdateUserParams = never;

const updateUserIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  bio = COALESCE(bio, $2),\n  email = COALESCE(email, $3),\n  image_urls = COALESCE(image_urls, $3),\n  nickname = COALESCE(nickname, $3),\n  oauth_naver = $4\nWHERE id = $1\n  AND (\n    bio IS NULL\n    OR email IS NULL\n    OR image_urls IS NULL\n    OR nickname IS NULL\n  )"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
 *   bio = COALESCE(bio, $2),
 *   email = COALESCE(email, $3),
 *   image_urls = COALESCE(image_urls, $3),
 *   nickname = COALESCE(nickname, $3),
 *   oauth_naver = $4
 * WHERE id = $1
 *   AND (
 *     bio IS NULL
 *     OR email IS NULL
 *     OR image_urls IS NULL
 *     OR nickname IS NULL
 *   )
 * ```
 */
export const updateUser = new PreparedQuery<IUpdateUserParams,IUpdateUserResult>(updateUserIR);


