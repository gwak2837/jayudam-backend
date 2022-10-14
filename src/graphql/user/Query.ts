import { poolQuery } from '../../common/postgres'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../fastify/errors'
import { GraphQLContext } from '../../routes'
import type { QueryResolvers } from '../generated/graphql'
import { decodeGrade, decodeSex } from './Object'
import type { IAuthResult } from './sql/auth'
import auth from './sql/auth.sql'
import type { IGetMyCertAgreementResult } from './sql/getMyCertAgreement'
import getMyCertAgreement from './sql/getMyCertAgreement.sql'
import type { IIsUniqueUsernameResult } from './sql/isUniqueUsername'
import isUniqueUsername from './sql/isUniqueUsername.sql'
import type { IMeResult } from './sql/me'
import me from './sql/me.sql'
import type { IMyProfileResult } from './sql/myProfile'
import myProfile from './sql/myProfile.sql'
import type { IUserByNameResult } from './sql/userByName'
import userByName from './sql/userByName.sql'

export const Query: QueryResolvers<GraphQLContext> = {
  auth: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IAuthResult>(auth, [userId])

    return {
      id: rows[0].id,
      name: rows[0].name,
    }
  },

  myCertAgreement: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IGetMyCertAgreementResult>(getMyCertAgreement, [userId])

    const me = rows[0]

    if (!me.cert_agreement)
      return {
        id: userId,
        certAgreement: {
          showBirthdate: false,
          showLegalName: false,
          showSex: false,
          showSTDTest: false,
          showImmunization: false,
          showSexualCrime: false,
        },
        cherry: me.cherry,
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
    } = JSON.parse(me.cert_agreement)

    return {
      id: userId,
      certAgreement: {
        showBirthdate: showBirthdate ?? false,
        showLegalName: showLegalName ?? false,
        showSex: showSex ?? false,
        showSTDTest: showSTDTest ?? false,
        ...(showSTDTest && stdTestSince && { stdTestSince }),
        showImmunization: showImmunization ?? false,
        ...(showImmunization && immunizationSince && { immunizationSince }),
        showSexualCrime: showSexualCrime ?? false,
        ...(showSexualCrime && sexualCrimeSince && { sexualCrimeSince }),
      },
      cherry: me.cherry,
    }
  },

  isUniqueUsername: async (_, { username }) => {
    const { rowCount } = await poolQuery<IIsUniqueUsernameResult>(isUniqueUsername, [username])

    return rowCount === 0
  },

  myProfile: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rowCount, rows } = await poolQuery<IMyProfileResult>(myProfile, [userId])

    if (rowCount === 0) throw NotFoundError('사용자를 찾을 수 없습니다')

    const myInfo = rows[0]

    return {
      id: myInfo.id,
      imageUrl: myInfo.image_urls,
    }
  },

  user: async (_, { name }, { userId }) => {
    if (!name && !userId) throw UnauthorizedError('로그인 후 시도해주세요')

    if (name === 'undefined' || name === 'null') throw BadRequestError('허용되지 않는 닉네임입니다')

    // 다른 사용자 정보
    if (name) {
      const { rowCount, rows } = await poolQuery<IUserByNameResult>(userByName, [name])
      if (rowCount === 0) throw NotFoundError(`\`${name}\` 사용자를 찾을 수 없습니다`)

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
        }
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
        }
      }

      if (otherUser.blocking_start_time) {
        return {
          id: otherUser.id,
          creationTime: otherUser.creation_time,
          blockingStartTime: otherUser.blocking_start_time,
          blockingEndTime: otherUser.blocking_end_time,
          name: otherUser.name,
          nickname: otherUser.nickname,
          postCount: otherUser.post_count,
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
        grade: decodeGrade(otherUser.grade),
        imageUrl: otherUser.image_urls?.[0],
        imageUrls: otherUser.image_urls,
        isPrivate: otherUser.is_private,
        isVerifiedSex: otherUser.is_verified_sex,
        name: otherUser.name,
        nickname: otherUser.nickname,
        postCount: otherUser.post_count,
        sex: decodeSex(otherUser.sex),
        towns: [
          { count: otherUser.town1_count, name: otherUser.town1_name },
          { count: otherUser.town2_count, name: otherUser.town2_name },
        ],
      }
    }

    // 내 정보
    const { rowCount, rows } = await poolQuery<IMeResult>(me, [userId])
    if (rowCount === 0) throw NotFoundError('탈퇴했거나 존재하지 않는 사용자입니다')

    const myInfo = rows[0]

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
      followerCount: myInfo.follower_count,
      followingCount: myInfo.following_count,
      grade: decodeGrade(myInfo.grade),
      imageUrl: myInfo.image_urls?.[0],
      imageUrls: myInfo.image_urls,
      isPrivate: myInfo.is_private,
      isVerifiedBirthday: myInfo.is_verified_birthday,
      isVerifiedBirthyear: myInfo.is_verified_birthyear,
      isVerifiedSex: myInfo.is_verified_sex,
      name: myInfo.name,
      nickname: myInfo.nickname,
      postCount: myInfo.post_count,
      sex: decodeSex(myInfo.sex),
      sleepingTime: myInfo.sleeping_time,
      towns: [
        { count: myInfo.town1_count, name: myInfo.town1_name },
        { count: myInfo.town2_count, name: myInfo.town2_name },
      ],
    }
  },
}
