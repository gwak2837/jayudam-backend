import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-errors'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { signJWT, verifyJWT } from '../../utils/jwt'
import { Cert, QueryResolvers } from '../generated/graphql'
import { IGetCertsResult } from './sql/getCerts'
import getCerts from './sql/getCerts.sql'
import useCherry from './sql/useCherry.sql'

// import myPosts from './sql/myPosts.sql'

export const Query: QueryResolvers<ApolloContext> = {}
