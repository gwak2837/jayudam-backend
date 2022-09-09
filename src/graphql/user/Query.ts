import { AuthenticationError, UserInputError } from 'apollo-server-errors'

import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { QueryResolvers, User } from '../generated/graphql'
import { IAuthResult } from './sql/auth'
import auth from './sql/auth.sql'
import { IGetMyCertAgreementResult } from './sql/getMyCertAgreement'
import getMyCertAgreement from './sql/getMyCertAgreement.sql'
import { IIsUniqueUsernameResult } from './sql/isUniqueUsername'
import isUniqueUsername from './sql/isUniqueUsername.sql'
import { IMeResult } from './sql/me'
import me from './sql/me.sql'
import { IMyProfileResult } from './sql/myProfile'
import myProfile from './sql/myProfile.sql'
import { IUserByNameResult } from './sql/userByName'
import userByName from './sql/userByName.sql'

export const Query: QueryResolvers<ApolloContext> = {
  auth: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IAuthResult>(auth, [userId])

    return {
      id: rows[0].id,
      name: rows[0].name,
    } as User
  },

  myCertAgreement: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IGetMyCertAgreementResult>(getMyCertAgreement, [userId])
    if (!rows[0].cert_agreement)
      return {
        showBirthdate: false,
        showLegalName: false,
        showSex: false,
        showSTDTest: false,
        showImmunization: false,
        showSexualCrime: false,
      }

    const {
      showBirthdate,
      showLegalName,
      showSex,
      showSTDTest,
      stdTestSince,
      showImmunization,
      immunizationSince,
      showSexualCrime,
      sexualCrimeSince,
    } = JSON.parse(rows[0].cert_agreement)

    return {
      showBirthdate: showBirthdate ?? false,
      showLegalName: showLegalName ?? false,
      showSex: showSex ?? false,
      showSTDTest: showSTDTest ?? false,
      ...(showSTDTest && stdTestSince && { stdTestSince }),
      showImmunization: showImmunization ?? false,
      ...(showImmunization && immunizationSince && { immunizationSince }),
      showSexualCrime: showSexualCrime ?? false,
      ...(showSexualCrime && sexualCrimeSince && { sexualCrimeSince }),
    }
  },

  isUniqueUsername: async (_, { username }) => {
    const { rowCount } = await poolQuery<IIsUniqueUsernameResult>(isUniqueUsername, [username])

    return rowCount === 0
  },

  myProfile: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요')

    const { rowCount, rows } = await poolQuery<IMyProfileResult>(myProfile, [userId])

    if (rowCount === 0) throw new NotFoundError('사용자를 찾을 수 없습니다')

    const myInfo = rows[0]
    console.log('👀 - myInfo', myInfo)

    return {
      id: myInfo.id,
      imageUrl: myInfo.image_urls,
    }
  },

  user: async (_, { name }, { userId }) => {
    if (!name && !userId) throw new AuthenticationError('로그인 후 시도해주세요')

    if (name === 'undefined' || name === 'null')
      throw new UserInputError('허용되지 않는 닉네임입니다')

    if (name) {
      const { rowCount, rows } = await poolQuery<IUserByNameResult>(userByName, [name])
      if (rowCount === 0) throw new NotFoundError(`\`${name}\` 사용자를 찾을 수 없습니다`)

      const otherUser = rows[0]

      if (otherUser.is_private) {
        return {
          id: otherUser.id,
          creationTime: otherUser.creation_time,
          bio: otherUser.bio,
          coverImageUrl: otherUser.cover_image_urls?.[0],
          coverImageUrls: otherUser.cover_image_urls,
          imageUrl: otherUser.image_urls?.[0],
          imageUrls: otherUser.image_urls,
          isPrivate: otherUser.is_private,
          name: otherUser.name,
          nickname: otherUser.nickname,
          postCount: otherUser.post_count,
        } as User
      }

      if (otherUser.sleeping_time) {
        return {
          id: otherUser.id,
          creationTime: otherUser.creation_time,
          bio: otherUser.bio,
          coverImageUrl: otherUser.cover_image_urls?.[0],
          coverImageUrls: otherUser.cover_image_urls,
          imageUrl: otherUser.image_urls?.[0],
          imageUrls: otherUser.image_urls,
          name: otherUser.name,
          nickname: otherUser.nickname,
          postCount: otherUser.post_count,
        } as User
      }

      if (otherUser.blocking_start_time) {
        return {
          id: otherUser.id,
          creationTime: otherUser.creation_time,
          blockingStartTime: otherUser.blocking_start_time,
          blockingEndTime: otherUser.blocking_end_time,
          name: otherUser.name,
          nickname: otherUser.nickname,
        }
      }

      return {
        id: otherUser.id,
        creationTime: otherUser.creation_time,
        bio: otherUser.bio,
        blockingStartTime: otherUser.blocking_start_time,
        blockingEndTime: otherUser.blocking_end_time,
        coverImageUrl: otherUser.cover_image_urls?.[0],
        coverImageUrls: otherUser.cover_image_urls,
        grade: otherUser.grade,
        imageUrl: otherUser.image_urls?.[0],
        imageUrls: otherUser.image_urls,
        isPrivate: otherUser.is_private,
        isVerifiedSex: otherUser.is_verified_sex,
        name: otherUser.name,
        nickname: otherUser.nickname,
        sex: otherUser.sex,
        towns: [
          { count: otherUser.town1_count, name: otherUser.town1_name },
          { count: otherUser.town2_count, name: otherUser.town2_name },
        ],
      } as User
    }

    const { rowCount, rows } = await poolQuery<IMeResult>(me, [userId])
    if (rowCount === 0) throw new NotFoundError('탈퇴했거나 존재하지 않는 사용자입니다')

    const myInfo = rows[0]

    if (myInfo.sleeping_time) {
      return {
        id: myInfo.id,
        creationTime: myInfo.creation_time,
        bio: myInfo.bio,
        imageUrl: myInfo.image_urls?.[0],
        imageUrls: myInfo.image_urls,
        name: myInfo.name,
        nickname: myInfo.nickname,
        postCount: myInfo.post_count,
      } as User
    }

    if (myInfo.blocking_start_time) {
      return {
        id: myInfo.id,
        creationTime: myInfo.creation_time,
        coverImageUrl: myInfo.cover_image_urls?.[0],
        coverImageUrls: myInfo.cover_image_urls,
        imageUrl: myInfo.image_urls?.[0],
        imageUrls: myInfo.image_urls,
        name: myInfo.name,
        nickname: myInfo.nickname,
      }
    }

    return {
      id: myInfo.id,
      creationTime: myInfo.creation_time,
      bio: myInfo.bio,
      birthday: myInfo.birthday,
      birthyear: myInfo.birthyear,
      blockingStartTime: myInfo.blocking_start_time,
      blockingEndTime: myInfo.blocking_end_time,
      coverImageUrl: myInfo.cover_image_urls?.[0],
      coverImageUrls: myInfo.cover_image_urls,
      cherry: myInfo.cherry,
      grade: myInfo.grade,
      imageUrl: myInfo.image_urls?.[0],
      imageUrls: myInfo.image_urls,
      isPrivate: myInfo.is_private,
      isVerifiedBirthday: myInfo.is_verified_birthday,
      isVerifiedBirthyear: myInfo.is_verified_birthyear,
      isVerifiedSex: myInfo.is_verified_sex,
      name: myInfo.name,
      nickname: myInfo.nickname,
      postCount: myInfo.post_count,
      sex: myInfo.sex,
      towns: [
        { count: myInfo.town1_count, name: myInfo.town1_name },
        { count: myInfo.town2_count, name: myInfo.town2_name },
      ],
    } as User
  },
}
