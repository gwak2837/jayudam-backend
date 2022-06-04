export const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string
export const secretKey = process.env.JWT_SECRET_KEY as string
export const connectionString = process.env.CONNECTION_STRING as string

if (!bucketName) throw new Error('`GOOGLE_CLOUD_STORAGE_BUCKET` 환경 변수를 설정해주세요.')
if (!secretKey) throw new Error('`JWT_SECRET_KEY` 환경 변수를 설정해주세요.')
if (!connectionString) throw new Error('`CONNECTION_STRING` 환경 변수를 설정해주세요.')
