import { NotImplementedError } from '../../fastify/errors'
import { GraphQLContext } from '../../fastify/server'
import { Grade, Sex, UserResolvers } from '../generated/graphql'

export const User: UserResolvers<GraphQLContext> = {
  towns: ({ towns }) => {
    const exactTowns = towns?.filter((town) => town.name)

    return exactTowns && exactTowns.length > 0 ? exactTowns : null
  },
}

export function decodeGrade(encodedGrade: number | null) {
  switch (encodedGrade) {
    case null:
      return null
    case 0:
      return Grade.Free
    case 1:
      return Grade.Pro
    case 2:
      return Grade.Enterprise
    default:
      throw NotImplementedError('잘못된 등급입니다')
  }
}

export function decodeSex(encodedSex: number | null) {
  switch (encodedSex) {
    case null:
      return null
    case 1:
      return Sex.Male
    case 2:
      return Sex.Female
    case 3:
      return Sex.Other
    default:
      throw NotImplementedError('잘못된 성별입니다')
  }
}
