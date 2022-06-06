export const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string
export const secretKey = process.env.JWT_SECRET_KEY as string
export const pgUri = process.env.PGURI as string
export const redisConnectionString = process.env.REDIS_CONNECTION_STRING as string
export const projectEnv = process.env.PROJECT_ENV as string
export const port = process.env.PORT as string

export const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY as string
export const kakaoAdminKey = process.env.KAKAO_ADMIN_KEY as string
export const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET as string

if (!bucketName) throw new Error('`GOOGLE_CLOUD_STORAGE_BUCKET` 환경 변수를 설정해주세요.')
if (!secretKey) throw new Error('`JWT_SECRET_KEY` 환경 변수를 설정해주세요.')
if (!pgUri) throw new Error('`PGURI` 환경 변수를 설정해주세요.')
if (!redisConnectionString) throw new Error('`REDIS_CONNECTION_STRING` 환경 변수를 설정해주세요.')
if (!projectEnv) throw new Error('`PROJECT_ENV` 환경 변수를 설정해주세요.')
if (!port) throw new Error('`PORT` 환경 변수를 설정해주세요.')

if (!kakaoRestApiKey) throw new Error('`KAKAO_REST_API_KEY` 환경 변수를 설정해주세요.')
if (!kakaoAdminKey) throw new Error('`KAKAO_ADMIN_KEY` 환경 변수를 설정해주세요.')
if (!kakaoClientSecret) throw new Error('`KAKAO_CLIENT_SECRET` 환경 변수를 설정해주세요.')
