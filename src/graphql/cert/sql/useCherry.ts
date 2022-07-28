/** Types generated for queries found in "src/graphql/cert/sql/useCherry.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'UseCherry' parameters type */
export type IUseCherryParams = void;

/** 'UseCherry' return type */
export type IUseCherryResult = void;

/** 'UseCherry' query type */
export interface IUseCherryQuery {
  params: IUseCherryParams;
  result: IUseCherryResult;
}

const useCherryIR: any = {"usedParamSet":{},"params":[],"statement":"UPDATE \"user\"\nSET cherry = cherry - 1\nWHERE id = $1"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET cherry = cherry - 1
 * WHERE id = $1
 * ```
 */
export const useCherry = new PreparedQuery<IUseCherryParams,IUseCherryResult>(useCherryIR);


