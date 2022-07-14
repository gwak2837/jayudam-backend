import { mergeResolvers } from '@graphql-tools/merge'

import * as certificateQueryResolver from './certificate/Query'
import * as commonResolver from './common/common'
import * as userMutationResolver from './user/Mutation'
import * as userQueryResolver from './user/Query'

const resolversArray = [
  certificateQueryResolver,
  commonResolver,
  userMutationResolver,
  userQueryResolver,
]

export const resolvers = mergeResolvers(resolversArray)
