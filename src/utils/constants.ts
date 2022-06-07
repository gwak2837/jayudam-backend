export const port = process.env.PORT as string
export const projectEnv = process.env.PROJECT_ENV as string
export const jwtSecretKey = process.env.JWT_SECRET_KEY as string

export const pgUri = process.env.PGURI as string
export const frontendUrl = process.env.FRONTEND_URL as string
export const redisConnectionString = process.env.REDIS_CONNECTION_STRING as string

export const googleCloudStorageBucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string

export const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY as string
export const kakaoAdminKey = process.env.KAKAO_ADMIN_KEY as string
export const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET as string

export const naverClientId = process.env.NAVER_CLIENT_ID as string
export const naverClientSecret = process.env.NAVER_CLIENT_SECRET as string
export const naverRedirectUri = process.env.NAVER_REDIRECT_URI as string

export const bBatonClientId = process.env.BBATON_CLIENT_ID as string
export const bBatonClientSecretKey = process.env.BBATON_CLIENT_SECRET_KEY as string
export const bBatonRedirectUri = process.env.BBATON_REDIRECT_URI as string

if (!port) throw new Error('`PORT` 환경 변수를 설정해주세요.')
if (!projectEnv) throw new Error('`PROJECT_ENV` 환경 변수를 설정해주세요.')
if (!jwtSecretKey) throw new Error('`JWT_SECRET_KEY` 환경 변수를 설정해주세요.')

if (!pgUri) throw new Error('`PGURI` 환경 변수를 설정해주세요.')
if (!frontendUrl) throw new Error('`FRONTEND_URL` 환경 변수를 설정해주세요.')
if (!redisConnectionString) throw new Error('`REDIS_CONNECTION_STRING` 환경 변수를 설정해주세요.')

if (!googleCloudStorageBucket)
  throw new Error('`GOOGLE_CLOUD_STORAGE_BUCKET` 환경 변수를 설정해주세요.')

if (!kakaoRestApiKey) throw new Error('`KAKAO_REST_API_KEY` 환경 변수를 설정해주세요.')
if (!kakaoAdminKey) throw new Error('`KAKAO_ADMIN_KEY` 환경 변수를 설정해주세요.')
if (!kakaoClientSecret) throw new Error('`KAKAO_CLIENT_SECRET` 환경 변수를 설정해주세요.')

if (!naverClientId) throw new Error('`NAVER_CLIENT_ID` 환경 변수를 설정해주세요.')
if (!naverClientSecret) throw new Error('`NAVER_CLIENT_SECRET` 환경 변수를 설정해주세요.')
if (!naverRedirectUri) throw new Error('`NAVER_REDIRECT_URI` 환경 변수를 설정해주세요.')

if (!bBatonClientId) throw new Error('`BBATON_CLIENT_ID` 환경 변수를 설정해주세요.')
if (!bBatonClientSecretKey) throw new Error('`BBATON_CLIENT_SECRET_KEY` 환경 변수를 설정해주세요.')
if (!bBatonRedirectUri) throw new Error('`BBATON_REDIRECT_URI` 환경 변수를 설정해주세요.')
