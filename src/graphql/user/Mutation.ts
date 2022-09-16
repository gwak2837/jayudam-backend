import { MercuriusContext } from 'mercurius'
import fetch from 'node-fetch'

import { poolQuery } from '../../database/postgres'
import { redisClient } from '../../database/redis'
import { BadGatewayError, BadRequestError, UnauthorizedError } from '../../fastify/errors'
import { unregisterKakaoUser } from '../../fastify/oauth/kakao'
import type { GraphQLContext } from '../../fastify/server'
import { KAKAO_REST_API_KEY } from '../../utils/constants'
import type { MutationResolvers, User } from '../generated/graphql'
import type { IDeleteUserResult } from './sql/deleteUser'
import deleteUser from './sql/deleteUser.sql'
import type { IDeleteUserInfoResult } from './sql/deleteUserInfo'
import deleteUserInfo from './sql/deleteUserInfo.sql'
import type { IGetUserInfoResult } from './sql/getUserInfo'
import getUserInfo from './sql/getUserInfo.sql'
import type { IUpdateUserResult } from './sql/updateUser'
import updateUser from './sql/updateUser.sql'
import type { IVerifyTownResult } from './sql/verifyTown'
import verifyTown from './sql/verifyTown.sql'

export const Mutation: MutationResolvers<GraphQLContext & MercuriusContext> = {
  logout: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const logoutTime = Date.now()
    const result = await redisClient.set(`${userId}:logoutTime`, logoutTime)
    if (result !== 'OK') throw BadGatewayError('Redis error')

    return {
      id: userId,
      logoutTime: new Date(logoutTime),
    } as User
  },

  unregister: async (_, __, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { rows } = await poolQuery<IGetUserInfoResult>(getUserInfo, [userId])

    // 정지된 사용자면 재가입 방지를 위해 사용자 개인정보만 삭제
    if (rows[0].blocking_end_time) {
      const { rows: rows2 } = await poolQuery<IDeleteUserInfoResult>(deleteUserInfo, [userId])

      return {
        id: userId,
        blockingStartTime: rows2[0].blocking_start_time,
        blockingEndTime: rows[0].blocking_end_time,
      } as User
    }

    // OAuth 연결 해제
    if (rows[0].oauth_kakao) unregisterKakaoUser(rows[0].oauth_kakao)
    // if (rows[0].oauth____) unregister___User(rows[0].oauth____)
    // if (rows[0].oauth____) unregister___User(rows[0].oauth____)
    // if (rows[0].oauth____) unregister___User(rows[0].oauth____)

    await poolQuery(deleteUser, [userId])

    return {
      id: userId,
    } as User
  },

  updateUser: async (_, { input }, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    if (Object.keys(input).length === 0) throw BadRequestError('하나 이상 입력해주세요')

    const name = input.name
    const nickname = input.nickname
    if (
      (nickname &&
        (illegalNickname.has(nickname) ||
          !nicknameRegex.test(nickname) ||
          nickname.length > 30 ||
          nickname.length < 2)) ||
      (name &&
        (illegalNickname.has(name) ||
          !nicknameRegex.test(name) ||
          name.length > 30 ||
          name.length < 2))
    )
      throw BadRequestError('허용되지 않는 이름입니다')

    const { rows } = await poolQuery<IUpdateUserResult>(updateUser, [
      userId,
      input.bio,
      JSON.stringify(input.certAgreement),
      input.email,
      input.imageUrls?.map((imageUrl) => imageUrl.href),
      name,
      nickname,
      JSON.stringify({
        ...input.serviceAgreement,
        termsAgreementTime: Date.now(),
        privacyAgreementTime: Date.now(),
        locationAgreementTime: Date.now(),
        adAgreementTime: Date.now(),
      }),
      input.town1Name,
      input.town2Name,
    ])

    return {
      id: userId,
      ...(input.bio && { bio: rows[0].bio }),
      ...(input.certAgreement && {
        certAgreement: rows[0].cert_agreement ? JSON.parse(rows[0].cert_agreement) : null,
      }),
      ...(input.email && { email: rows[0].email }),
      ...(input.imageUrls && { imageUrls: rows[0].image_urls }),
      ...(name && { name: rows[0].name }),
      ...(nickname && { nickname: rows[0].nickname }),
      ...(input.serviceAgreement && {
        serviceAgreement: rows[0].service_agreement ? JSON.parse(rows[0].service_agreement) : null,
      }),
      ...(input.town1Name && { town1Name: rows[0].town1_name }),
      ...(input.town2Name && { town2Name: rows[0].town2_name }),
    } as User
  },

  verifyTown: async (_, { lat, lon }, { userId }) => {
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const { documents } = await getLegalTown(lat, lon)
    if (!documents) throw BadRequestError('해당 주소를 찾을 수 없습니다')

    const legalTown = documents.find((document) => document.region_type === 'B')
    if (!legalTown?.region_3depth_name) throw BadRequestError('해당 주소를 찾을 수 없습니다')

    const { rows } = await poolQuery<IVerifyTownResult>(verifyTown, [
      userId,
      `${legalTown.region_2depth_name} ${legalTown.region_3depth_name}`,
    ])

    return {
      id: userId,
      towns: [
        { count: rows[0].town1_count, name: rows[0].town1_name },
        { count: rows[0].town2_count, name: rows[0].town2_name },
      ],
    } as User
  },
}

type KakaoLegalTownResult = {
  meta: Record<string, any>
  documents: Record<string, any>[]
}

async function getLegalTown(lat: any, lon: any) {
  const querystring = new URLSearchParams({
    x: lon,
    y: lat,
  })
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?${querystring}`,
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    }
  )
  return response.json() as Promise<KakaoLegalTownResult>
}

const nicknameRegex = /^[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\uAC00-\uD79D]+$/u

const illegalNickname = new Set([
  'undefined',
  'null',
  '보지',
  '자지',
  '섹스',
  'D쥐고',
  'D지고',
  'gartic',
  'jonna',
  'jot같',
  'mi쳤',
  'tlqkf',
  'wlfkf',
  '갈틱폰',
  '같은새끼',
  '개새끼',
  '개같아',
  '개같은',
  '개같을',
  '개같게',
  '개나대',
  '개나소나',
  '개넷',
  '개년',
  '개념빠가',
  '느갭',
  '도태남',
  '도태녀',
  '도.태',
  '도1태',
  '개독',
  '개돼지',
  '개련',
  '개련',
  '개부랄',
  '개삼성',
  '개새기',
  '개새끼',
  '개섹',
  '풀발',
  '씹선',
  '개셈',
  '개소리',
  '개쓰래기',
  '개저씨',
  '거지같',
  '그지',
  '계새끼',
  '골1빈',
  '골빈',
  '괘새끼',
  '그1켬',
  '그지같',
  '김치녀',
  '한녀',
  '한.녀',
  '한남들',
  '한.남',
  '그남들',
  '자들자들',
  '된장녀',
  '피싸개',
  '앙기모띠',
  '보이루',
  '소추',
  '퍄퍄',
  '방구석',
  '석스',
  '형보수지',
  '눈나',
  '김여사',
  '남적남',
  '여적여',
  '자적자',
  '보적보',
  '삼일한',
  '보슬아치',
  '보징어',
  '엑윽',
  '헤으응',
  '이기야',
  '부왘',
  '보픈카',
  '보라니',
  '상폐녀',
  '배빵',
  '누보햄',
  '자박꼼',
  '로린',
  '아몰랑',
  '업계포상',
  '번녀',
  '번남',
  '대남',
  '대녀',
  '개념녀',
  '냄저',
  '빨갱',
  '뷔페미',
  '급남',
  '등남',
  '급녀',
  '등녀',
  '꼴페',
  '문재앙',
  '윤재앙',
  '렬.이다',
  '렬이다',
  '쿵쾅',
  '쿵.쾅',
  '펨베',
  '펨코',
  '펨.코',
  '엠팍',
  '쿰.척',
  '쿰척',
  'ㅗㅜㅑ',
  '오우야',
  '껒여',
  '꺼지세요',
  '꺼져요',
  '로꺼져',
  '꺼.지',
  '꼴데',
  '설거지론',
  '퐁퐁남',
  '퐁퐁녀',
  '나빼썅',
  '나쁜새끼',
  '넌씨눈',
  '년놈',
  '노알라',
  '노인네',
  '노친네',
  '느그',
  '느금',
  '뇌 텅',
  '뇌1텅',
  '뇌텅',
  '눈깔파',
  '눈새',
  '늬믜',
  '늬미',
  '니년',
  '니믜',
  '니미럴',
  '닝기리',
  '닥1',
  '닥2',
  '닥전',
  '닥쳐라',
  '닥치세',
  '닥후',
  '대가리',
  '머가리',
  '머.가리',
  '대.가리',
  '꽃밭',
  '꽃.밭',
  '대갈',
  '덬',
  '도라이',
  '도랏',
  '도랐',
  '도른',
  '돌앗구만',
  '돌앗나',
  '돌앗네',
  '돌았구만',
  '돌았나',
  '돌았네',
  '둄마',
  '뒈져',
  '뒤져라',
  '뒤져버',
  '뒤져야',
  '뒤져야지',
  '뒤져요',
  '뒤졌',
  '뒤지겠',
  '뒤지고싶',
  '뒤지길',
  '뒤진다',
  '뒤질',
  '듣보',
  '디져라',
  '디졌',
  '디지고',
  '디질',
  '딴년',
  '또라이',
  '또라인',
  '똘아이',
  '아재',
  '네아줌마',
  '네아저씨',
  '뚝배기깨',
  '뚫린입',
  '라면갤',
  '런년',
  '럼들',
  '레1친',
  '레기같',
  '레기네',
  '레기다',
  '레친',
  '롬들',
  'ㅁ.ㄱ',
  'ㅁㅊ',
  'ㅁ친',
  '미새',
  '맘충',
  '🤏🏻',
  '🤏',
  '망돌',
  '머갈',
  '머리텅',
  '먹.금',
  '먹.끔',
  '먹1금',
  '먹금',
  '먹끔',
  '명존',
  '뭔솔',
  '믜칀',
  '믜친',
  '미1친',
  '미놈',
  '미시친발',
  '미쳣네',
  '미쳤니',
  '미췬',
  '미칀',
  '미친~',
  '미친개',
  '미친새',
  '미친색',
  '미틴',
  '및힌',
  '줘패',
  '꼬추',
  '색퀴',
  '한남들',
  '흉자',
  '미친넘',
  '및친',
  'GR도',
  '미핀놈',
  '샛기',
  '폐급',
  'xportsnews',
  'G랄',
  '세키',
  '미치누',
  'd져',
  '발놈',
  '별창',
  '병1신',
  '병맛',
  '병신',
  '봊',
  '보전깨',
  '싸개',
  '븅신',
  '빠큐',
  '빡새끼',
  '빻았',
  '빻은',
  '뻐규',
  '뻐큐',
  '뻑유',
  '뻑큐',
  '뻨큐',
  '뼈큐',
  '쉰내',
  '사새끼',
  '새.끼',
  '새1끼',
  '새1키',
  '새77ㅣ',
  '새끼라',
  '새끼야',
  '새퀴',
  '새킈',
  '새키',
  '색희',
  '색히',
  '샊기',
  '샊히',
  '샹년',
  '섀키',
  '서치해',
  '섬숭이',
  '성괴',
  '솔1친',
  '솔친',
  '쉬발',
  '쉬버',
  '쉬이바',
  '쉬이이',
  '쉬펄',
  '슈1발',
  '슈레기',
  '슈발',
  '슈벌',
  '슈우벌',
  '슈ㅣ발',
  '스벌',
  '슨상님',
  '싑창',
  '시1발',
  '시미발친',
  '시미친발',
  '시바라지',
  '시바류',
  '시바시바',
  '시바알',
  '시발',
  '닥 쳐',
  '쌉스',
  '썩열',
  '썩렬',
  '쎡열',
  '쎡렬',
  '대깨',
  '야랄',
  '버튼눌',
  '버튼 눌',
  'egr',
  '발작',
  '발.작',
  '렬받',
  '렬스',
  '아줌내',
  '머깨',
  '석열하',
  '석열스',
  '등신아',
  '미친것',
  '개때리',
  '개떄려',
  '염병하',
  '염병짓',
  '종간나',
  '빠가사리',
  '새기들',
  '애새기',
  'ktestone',
  '❌',
  '✖️',
  '🖕',
  '시방새',
  '시벌탱',
  '시볼탱',
  '시부럴',
  '시부렬',
  '시부울',
  '시뷰럴',
  '시뷰렬',
  '시빨',
  '시새발끼',
  '시이발',
  '시친발미',
  '시키가',
  '시팔',
  '시펄',
  '십창',
  '퐁퐁단',
  '십팔',
  '싸가지 없',
  '싸가지없',
  '싸물어',
  '쌉가',
  '쌍년',
  '쌍놈',
  '쌔끼',
  '썅',
  '썌끼',
  '쒸펄',
  '쓰1레기',
  '쓰래기같',
  '쓰레기 새',
  '쓰레기새',
  '쓰렉',
  '씝창',
  '씨1발',
  '씨바라',
  '씨바알',
  '씨발',
  '씨.발',
  '씨방새',
  '씨버럼',
  '씨벌',
  '씨벌탱',
  '씨볼탱',
  '씨부럴',
  'link.coupang',
  '씨부렬',
  '씨뷰럴',
  '씨뷰렬',
  '씨빠빠',
  '씨빨',
  '씨뻘',
  '씨새발끼',
  '씨이발',
  '씨팔',
  '씹귀',
  '씹못',
  '씹뻐럴',
  '씹새끼',
  '씹쌔',
  '씹창',
  '씹치',
  '씹팔',
  '씹할',
  '아가리',
  '아닥',
  '더쿠',
  '덬',
  '더.쿠',
  '아오시바',
  '안물안궁',
  '애미',
  '앰창',
  '닥눈삼',
  '에라이 퉤',
  '에라이 퉷',
  '에라이퉤',
  '에라이퉷',
  '엠뷩신',
  '엠븽신',
  '엠빙신',
  '시녀',
  '엠생',
  '엠창',
  '엿같',
  '엿이나',
  '예.질',
  '예1질',
  '예질',
  '옘병',
  '외1퀴',
  '외퀴',
  '웅앵',
  '웅엥',
  '은년',
  '은새끼',
  '이새끼',
  '입털',
  '작작',
  '지잡',
  '절라',
  '정신나갓',
  '정신나갔',
  '젗같',
  '젼나',
  '젼낰',
  '졀라',
  '졀리',
  '졌같은',
  '조낸',
  '조녜',
  '조온',
  '조온나',
  '족까',
  '존,나',
  '존.나',
  '존1',
  '존1나',
  '🚬',
  '존귀',
  '존귘',
  '존ㄴ나',
  '존나',
  '존낙',
  '존내',
  '존똑',
  '존맛',
  '존멋',
  '존버',
  '존싫',
  '존쎄',
  '존쎼',
  '존예',
  '존웃',
  '존잘',
  '존잼',
  '존좋',
  '존트',
  '졸귀',
  '졸귘',
  '졸라 ',
  '졸맛',
  '졸멋',
  '졸싫',
  '졸예',
  '졸웃',
  '졸잼',
  '졸좋',
  '좁밥',
  '멍청',
  '능지',
  '조센징',
  '짱깨',
  '짱개',
  '짱꼴라',
  '착짱',
  '착.',
  '챡.',
  '죽짱',
  '쥭.',
  '쨩.',
  '짱.',
  '쨩1',
  '착1',
  '쥭1',
  '짱골라',
  '좃',
  '종나',
  '곱창났',
  '곱창나',
  '좆',
  '좋소',
  '좇같',
  '죠낸',
  '죠온나',
  '죤나',
  '죤내',
  '죵나',
  '죶',
  '죽어버려',
  '죽여 버리고',
  '죽여버리고',
  '죽여불고',
  '죽여뿌고',
  '줬같은',
  '쥐랄',
  '쥰나',
  '쥰내',
  '쥰니',
  '쥰트',
  '즤랄',
  '지 랄',
  '지1랄',
  '지1뢰',
  '지껄이',
  '지들이',
  '지랄',
  'ezr',
  '2zr',
  '2gr',
  '지롤',
  '렬같',
  '열같',
  '찢재',
  '찢1',
  '우동사리',
  '석내',
  '렬.하',
  '열.하',
  '짱깨',
  '꼴라',
  '꿜라',
  '짱께',
  '쪼녜',
  '쪼다',
  '착짱죽짱',
  '섬숭이',
  '쪽본',
  '쪽1바리',
  '쪽바리',
  '쪽발',
  '쫀1',
  '쫀귀',
  '쫀맛',
  '쫂',
  '쫓같',
  '쬰잘',
  '쬲',
  '쯰질',
  '찌1질',
  '찌질한',
  '찍찍이',
  '찎찎이',
  '찝째끼',
  '창년',
  '창녀',
  '창남',
  '창놈',
  '창넘',
  '처먹',
  '凸',
  '첫빠',
  '쳐마',
  '쳐먹',
  '쳐받는',
  '쳐발라',
  '취ㅈ',
  '취좃',
  '친구년',
  '친년',
  '한년',
  '친노마',
  '친놈',
  'colormytree',
  '핑1프',
  '핑거프린세스',
  '핑끄',
  '핑프',
  '헛소리',
  '손놈',
  '혐석',
  '호로새끼',
  '호로잡',
  '화낭년',
  '화냥년',
  '후.려',
  '후1려',
  '후1빨',
  '후려',
  '후빨',
])
