/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import fastify from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    userId: string
  }
  // interface FastifyReply {
  //   myPluginProp: number
  // }
}
