/** Types generated for queries found in "src/express/oauth/sql/updateKakaoUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** Query 'UpdateKakaoUser' is invalid, so its result is assigned type 'never' */
export type IUpdateKakaoUserResult = never;

/** Query 'UpdateKakaoUser' is invalid, so its parameters are assigned type 'never' */
export type IUpdateKakaoUserParams = never;

const updateKakaoUserIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  email = COALESCE(email, $2),\n  image_urls = COALESCE(image_urls, $3),\n  oauth_kakao = $4\nWHERE id = $1\n  AND (\n    email IS NULL\n    OR image_urls IS NULL\n  )"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
 *   email = COALESCE(email, $2),
 *   image_urls = COALESCE(image_urls, $3),
 *   oauth_kakao = $4
 * WHERE id = $1
 *   AND (
 *     email IS NULL
 *     OR image_urls IS NULL
 *   )
 * ```
 */
export const updateKakaoUser = new PreparedQuery<IUpdateKakaoUserParams,IUpdateKakaoUserResult>(updateKakaoUserIR);


