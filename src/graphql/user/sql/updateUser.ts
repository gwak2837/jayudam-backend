/** Types generated for queries found in "src/graphql/user/sql/updateUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type stringArray = (string)[];

/** 'UpdateUser' parameters type */
export type IUpdateUserParams = void;

/** 'UpdateUser' return type */
export interface IUpdateUserResult {
  bio: string | null;
  cert_agreement: string | null;
  email: string | null;
  image_urls: stringArray | null;
  name: string | null;
  nickname: string | null;
  service_agreement: string | null;
  town1_name: string | null;
  town2_name: string | null;
}

/** 'UpdateUser' query type */
export interface IUpdateUserQuery {
  params: IUpdateUserParams;
  result: IUpdateUserResult;
}

const updateUserIR: any = {"usedParamSet":{},"params":[],"statement":"                                                     \nUPDATE \"user\"\nSET update_time = CURRENT_TIMESTAMP,\n  bio = COALESCE($2, bio),\n  cert_agreement = COALESCE($3, cert_agreement),\n  email = COALESCE($4, email),\n  image_urls = COALESCE($5, image_urls),\n  name = COALESCE($6, name),\n  nickname = COALESCE($7, nickname),\n  service_agreement = COALESCE($8, service_agreement),\n  town1_name = COALESCE($9, town1_name),\n  town1_count = CASE\n    WHEN $9 IS NULL THEN town1_count\n    ELSE 0\n  END,\n  town2_name = COALESCE($10, town2_name),\n  town2_count = CASE\n    WHEN $10 IS NULL THEN town2_count\n    ELSE 0\n  END\nWHERE id = $1\nRETURNING bio,\n  cert_agreement,\n  email,\n  image_urls,\n  name,\n  nickname,\n  service_agreement,\n  town1_name,\n  town2_name"};

/**
 * Query generated from SQL:
 * ```
 *                                                      
 * UPDATE "user"
 * SET update_time = CURRENT_TIMESTAMP,
 *   bio = COALESCE($2, bio),
 *   cert_agreement = COALESCE($3, cert_agreement),
 *   email = COALESCE($4, email),
 *   image_urls = COALESCE($5, image_urls),
 *   name = COALESCE($6, name),
 *   nickname = COALESCE($7, nickname),
 *   service_agreement = COALESCE($8, service_agreement),
 *   town1_name = COALESCE($9, town1_name),
 *   town1_count = CASE
 *     WHEN $9 IS NULL THEN town1_count
 *     ELSE 0
 *   END,
 *   town2_name = COALESCE($10, town2_name),
 *   town2_count = CASE
 *     WHEN $10 IS NULL THEN town2_count
 *     ELSE 0
 *   END
 * WHERE id = $1
 * RETURNING bio,
 *   cert_agreement,
 *   email,
 *   image_urls,
 *   name,
 *   nickname,
 *   service_agreement,
 *   town1_name,
 *   town2_name
 * ```
 */
export const updateUser = new PreparedQuery<IUpdateUserParams,IUpdateUserResult>(updateUserIR);


