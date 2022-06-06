import { type Express } from 'express'

export function setNaverOAuthStrategies(app: Express) {
  app.get('/oauth/naver', async (req, res) => {
    if (!req.query.code) {
      return res.status(400).send('400 Bad Request')
    }
  })

  app.get('/oauth/naver/unregister', async (req, res) => {
    console.log('👀 - req.query.user_id', req.query.user_id)
    console.log('👀 - req.query.referrer_type', req.query.referrer_type)
  })
}
