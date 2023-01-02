import { ServiceUnavailableError, UnauthorizedError } from '../../common/fastify'
import { poolQuery } from '../../common/postgres'
import { redisClient } from '../../common/redis'
import { UserStatus } from './object'
import { IMyChatroomIdsResult } from './sql/myChatroomIds'
import myChatroomIds from './sql/myChatroomIds.sql'
import { IMyLeaderIdsResult } from './sql/myLeaderIds'
import myLeaderIds from './sql/myLeaderIds.sql'
import { TFastify } from '..'

export default function pushQuery(fastify: TFastify) {
  // EventSource: chatroom, status, newChatroom, ad
  fastify.get('/subscribe', async (request, reply) => {
    const userId = request.userId
    if (!userId) throw UnauthorizedError('로그인 후 시도해주세요')

    // HTTP2 server push header
    const raw = reply.raw

    const headers = reply.getHeaders()
    for (const key in headers) {
      raw.setHeader(key, headers[key] ?? '')
    }
    raw.setHeader('Content-Type', 'text/event-stream')
    raw.setHeader('Cache-Control', 'no-cache,no-transform')

    raw.write('retry: 60000\n\n')
    // // request.socket.setTimeout(3_600)

    // Fetch data
    const { rows } = await poolQuery<IMyChatroomIdsResult>(myChatroomIds, [userId])
    const myChatroomChannels = rows.map((row) => `chatroom:${row.chatroom_id}`)

    const { rows: rows2 } = await poolQuery<IMyLeaderIdsResult>(myLeaderIds, [userId])
    const myLeaderChannels = rows2.map((row) => `status:${row.leader_id}`)

    // Redis Pub/Sub
    const redisSubscription = redisClient.duplicate()

    redisSubscription.subscribe(
      ...myChatroomChannels,
      ...myLeaderChannels,
      `newChatroom:${userId}`,
      `ad:${userId}:ad`,
      (err) => {
        if (err) throw ServiceUnavailableError(err.message)
      }
    )

    redisSubscription.on('message', (channel: string, message) => {
      raw.write(`event: ${channel.split(':')[0]}\ndata: ${message}\n\n`)
    })

    redisClient.publish(`status:${userId}`, String(UserStatus.ONLINE))

    // HTTP2 연결 끊기면
    request.raw.on('close', () => {
      redisClient.publish(`status:${userId}`, String(UserStatus.OFFLINE))
      redisSubscription.quit()
    })
  })
}
