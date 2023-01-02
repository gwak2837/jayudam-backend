/** Types generated for queries found in "src/routes/chat/sql/messageSender.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'MessageSender' parameters type */
export type IMessageSenderParams = void;

/** 'MessageSender' return type */
export interface IMessageSenderResult {
  image_url: string | null;
  name: string | null;
  nickname: string | null;
}

/** 'MessageSender' query type */
export interface IMessageSenderQuery {
  params: IMessageSenderParams;
  result: IMessageSenderResult;
}

const messageSenderIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  name,\n  nickname,\n  image_urls[1] AS image_url\nFROM\n  \"user\"\nWHERE\n  id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   name,
 *   nickname,
 *   image_urls[1] AS image_url
 * FROM
 *   "user"
 * WHERE
 *   id = $1
 * ```
 */
export const messageSender = new PreparedQuery<IMessageSenderParams,IMessageSenderResult>(messageSenderIR);


