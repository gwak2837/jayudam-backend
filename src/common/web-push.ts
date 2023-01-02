import webpush from 'web-push'

import { GOOGLE_FIREBASE_API_KEY, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from './constants'

const SUBJECT = 'mailto:jayudam2022@gmail.com'

webpush.setGCMAPIKey(GOOGLE_FIREBASE_API_KEY)
webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

export default webpush
