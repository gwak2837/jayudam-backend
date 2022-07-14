/** Types generated for queries found in "src/express/oauth/sql/updateNaverUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'UpdateNaverUser' parameters type */
export type IUpdateNaverUserParams = void;

/** 'UpdateNaverUser' return type */
export type IUpdateNaverUserResult = void;

/** 'UpdateNaverUser' query type */
export interface IUpdateNaverUserQuery {
  params: IUpdateNaverUserParams;
  result: IUpdateNaverUserResult;
}

const updateNaverUserIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  email = COALESCE(email, $2),\n  image_urls = COALESCE(image_urls, $3),\n  oauth_naver = $4\nWHERE id = $1\n  AND (\n    email IS NULL\n    OR image_urls IS NULL\n  )"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
 *   email = COALESCE(email, $2),
 *   image_urls = COALESCE(image_urls, $3),
 *   oauth_naver = $4
 * WHERE id = $1
 *   AND (
 *     email IS NULL
 *     OR image_urls IS NULL
 *   )
 * ```
 */
export const updateNaverUser = new PreparedQuery<IUpdateNaverUserParams,IUpdateNaverUserResult>(updateNaverUserIR);


