/** Types generated for queries found in "src/express/oauth/sql/getKakaoUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetKakaoUser' parameters type */
export type IGetKakaoUserParams = void;

/** 'GetKakaoUser' return type */
export interface IGetKakaoUserResult {
  birthday: string | null;
  birthyear: string | null;
  blocking_end_time: Date | null;
  blocking_start_time: Date | null;
  id: string;
  name: string | null;
  nickname: string | null;
  phone_number: string | null;
  sex: number | null;
  sleeping_time: Date | null;
}

/** 'GetKakaoUser' query type */
export interface IGetKakaoUserQuery {
  params: IGetKakaoUserParams;
  result: IGetKakaoUserResult;
}

const getKakaoUserIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT id,\n  blocking_start_time,\n  blocking_end_time,\n  nickname,\n  name,\n  sex,\n  birthyear,\n  birthday,\n  phone_number,\n  sleeping_time\nFROM \"user\"\nWHERE kakao_oauth = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id,
 *   blocking_start_time,
 *   blocking_end_time,
 *   nickname,
 *   name,
 *   sex,
 *   birthyear,
 *   birthday,
 *   phone_number,
 *   sleeping_time
 * FROM "user"
 * WHERE kakao_oauth = $1
 * ```
 */
export const getKakaoUser = new PreparedQuery<IGetKakaoUserParams,IGetKakaoUserResult>(getKakaoUserIR);


