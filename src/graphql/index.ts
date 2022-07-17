import { mergeResolvers } from '@graphql-tools/merge'

import * as certMutationResolver from './cert/Mutation'
import * as certrObjectResolver from './cert/Object'
import * as certQueryResolver from './cert/Query'
import * as commonResolver from './common/common'
import * as userMutationResolver from './user/Mutation'
import * as userObjectResolver from './user/Object'
import * as userQueryResolver from './user/Query'

const resolversArray = [
  certMutationResolver,
  certrObjectResolver,
  certQueryResolver,
  commonResolver,
  userMutationResolver,
  userObjectResolver,
  userQueryResolver,
]

export const resolvers = mergeResolvers(resolversArray)
