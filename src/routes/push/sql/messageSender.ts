/** Types generated for queries found in "src/routes/push/sql/messageSender.sql" */
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

const messageSenderIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT name,\n  nickname,\n  image_urls [0] AS image_url\nFROM \"user\"\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT name,
 *   nickname,
 *   image_urls [0] AS image_url
 * FROM "user"
 * WHERE id = $1
 * ```
 */
export const messageSender = new PreparedQuery<IMessageSenderParams,IMessageSenderResult>(messageSenderIR);


