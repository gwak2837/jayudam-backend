import { randomUUID } from 'crypto'
import path from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

import multipart from '@fastify/multipart'

import { bucket } from '../database/google-storage'
import { FastifyHttp2 } from './server'

// import sharp from 'sharp'

const pipe = promisify(pipeline)

// https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage
export function setUploadingFiles(fastify: FastifyHttp2) {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      // fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 10_000_000, // For multipart forms, the max file size in bytes
      files: 10, // Max number of file fields
      // headerPairs: 2000, // Max number of header key=>value pairs
    },
  })

  type HeadersFileId = {
    Headers: {
      'x-file-id': string
    }
  }

  const headerFileId = {
    schema: {
      headers: {
        type: 'object',
        properties: {
          'x-file-id': { type: 'string', pattern: '^[A-Za-z0-9]+$' },
        },
        required: ['x-file-id'],
      },
    },
  }

  fastify.post<HeadersFileId>('/upload', headerFileId, async function (req, res) {
    const files = req.files()
    const uploadedFiles: Record<string, string>[] = []

    for await (const file of files) {
      if (file.file) {
        const fileId = req.headers['x-file-id']
        const timestamp = ~~(Date.now() / 1000)
        const fileExtension = path.extname(file.filename)
        const fileName = `${fileId}-${timestamp}-${randomUUID()}${fileExtension}`
        const blobStream = bucket.file(fileName).createWriteStream()

        blobStream.on('error', (err) => {
          console.error(err)
          res.code(503).send('File upload to Google Cloud failed')
        })

        blobStream.on('finish', () => {
          uploadedFiles.push({
            fileName: file.filename,
            url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
          })
        })

        // Stream
        // await pipe(file.file, blobStream)

        // Buffer
        const buffer = await file.toBuffer()
        await new Promise((resolve) => {
          blobStream.end(buffer, () => resolve(''))
        })
      }
    }

    res.send(uploadedFiles)
  })
}

// const allowedExtensions = ['image', 'video', 'audio', 'application/ogg']
// function isExtensionAllowed(file: any) {
//   for (const allowedExtension of allowedExtensions) {
//     if (file.mimetype.startsWith(allowedExtension)) return true
//   }
//   return false
// }
