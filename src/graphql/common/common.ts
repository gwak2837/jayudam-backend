import { GraphQLScalarType, Kind } from 'graphql'
import {
  DateTimeResolver,
  EmailAddressResolver,
  JWTResolver,
  LatitudeResolver,
  LongitudeResolver,
  NonEmptyStringResolver,
  NonNegativeIntResolver,
  PositiveIntResolver,
  URLResolver,
  UUIDResolver,
} from 'graphql-scalars'

export const DateTime = DateTimeResolver
export const EmailAddress = EmailAddressResolver
export const JWT = JWTResolver
export const Latitude = LatitudeResolver
export const Longitude = LongitudeResolver
export const NonEmptyString = NonEmptyStringResolver
export const NonNegativeInt = NonNegativeIntResolver
export const PositiveInt = PositiveIntResolver
export const URL = URLResolver
export const UUID = UUIDResolver

export const Any = new GraphQLScalarType({
  name: 'Any',
  description: 'Any value',
  parseValue: (value) => value,
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.BOOLEAN:
      case Kind.STRING:
        return ast.value
      case Kind.INT:
      case Kind.FLOAT:
        return Number(ast.value)
      default:
        throw new Error(`Unexpected kind in parseLiteral: ${ast.kind}`)
    }
  },
  serialize: (value) => value,
})
