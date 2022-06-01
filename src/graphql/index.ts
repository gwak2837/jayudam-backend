import { mergeResolvers } from '@graphql-tools/merge'

import * as commonResolver from './common/common'

const resolversArray = [commonResolver]

export const resolvers = mergeResolvers(resolversArray)
