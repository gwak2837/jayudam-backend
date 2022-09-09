import { UserResolvers } from '../generated/graphql'

export const Sex = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2,
  OTHER: 3,
}

export const Grade = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
}

export const User: UserResolvers = {
  towns: ({ towns }) => {
    const exactTowns = towns?.filter((town) => town.name)

    return exactTowns && exactTowns.length > 0 ? exactTowns : null
  },
}
