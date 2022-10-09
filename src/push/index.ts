import webpush from 'web-push'

import { VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } from '../utils/constants'

const SUBJECT = 'mailto:jayudam2022@gmail.com'

webpush.setGCMAPIKey('GCM_KEY')
webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

export default webpush
