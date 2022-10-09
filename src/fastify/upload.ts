import { randomUUID } from 'crypto'
import path from 'path'
import { pipeline } from 'stream'

import multipart from '@fastify/multipart'

import { bucket } from '../database/google-storage'
import { BadRequestError, ServiceUnavailableError, UnauthorizedError } from './errors'
import { FastifyHttp2 } from './server'

// import sharp from 'sharp'

type UploadResult = {
  fileName: string
  url: string
}

export function setUploadingFiles(fastify: FastifyHttp2) {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      // fieldSize: 100, // Max field value size in bytes
      fields: 4, // Max number of non-file fields
      fileSize: 10_000_000, // For multipart forms, the max file size in bytes
      files: 4, // Max number of file fields
      // headerPairs: 2000, // Max number of header key=>value pairs
    },
  })

  fastify.post('/upload/images', async function (request, reply) {
    if (!request.userId) throw UnauthorizedError('로그인 후 시도해주세요')

    const files = request.files()
    const result: UploadResult[] = []

    for await (const file of files) {
      if (file.file) {
        if (!file.mimetype.startsWith('image/'))
          throw BadRequestError('이미지 파일만 업로드할 수 있습니다')

        const timestamp = ~~(Date.now() / 1000)
        const fileExtension = path.extname(file.filename)
        const fileName = `${timestamp}-${randomUUID()}${fileExtension}`
        const blobStream = bucket.file(fileName).createWriteStream()

        blobStream.on('error', (err) => {
          console.error(err)
          throw ServiceUnavailableError('File upload to Google Cloud failed')
        })

        blobStream.on('finish', () => {
          result.push({
            fileName: file.filename,
            url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
          })
        })

        // 1. Stream
        // pipeline(file.file, blobStream)

        // 2. Buffer
        const buffer = await file.toBuffer()
        await new Promise((resolve) => {
          blobStream.end(buffer, () => resolve(''))
        })
      }
    }

    reply.status(201).send(result)
  })
}
