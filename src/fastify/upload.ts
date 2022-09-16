import { Storage } from '@google-cloud/storage'
import { FastifyInstance } from 'fastify'
import path from 'node:path'
import multipart from '@fastify/multipart'

import { sha128 } from '../utils'
import { GOOGLE_CLOUD_STORAGE_BUCKET } from '../utils/constants'
import { FastifyHttp2 } from './server'

// import sharp from 'sharp'

// https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage
export function setUploadingFiles(fastify: FastifyHttp2) {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 10_000_000, // For multipart forms, the max file size in bytes
      files: 1, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  })

  fastify.post('/upload', async function (req, reply) {
    // process a single file
    // also, consider that if you allow to upload multiple files
    // you must consume all files otherwise the promise will never fulfill
    const data = await req.file()

    // data.file // stream
    // data.fields // other parsed parts
    // data.fieldname
    // data.filename
    // data.encoding
    // data.mimetype

    // to accumulate the file in memory! Be careful!
    //
    // await data.toBuffer() // Buffer
    //
    // or

    // await pump(data.file, fs.createWriteStream(data.filename))

    // be careful of permission issues on disk and not overwrite
    // sensitive files that could cause security risks

    // also, consider that if the file stream is not consumed, the promise will never fulfill

    reply.send()
  })

  // app.post('/upload', multer.array('file', 10), async (req: any, res: any) => {
  //   const files = req.files

  //   if (!Array.isArray(files)) return res.status(400).send('Bad Request')

  //   if (!files.length) return res.status(400).send('No file uploaded')

  //   for (let i = 0; i < files.length; i++) {
  //     if (!isExtensionAllowed(files[i]))
  //       return res.status(400).send(`The extension of ${i}th file is unauthorized.`)
  //   }

  //   try {
  //     const imageUrls = await Promise.all(files.map((file) => uploadFileToCloudStorage(file)))
  //     return res.status(200).json({ imageUrls })
  //   } catch (error) {
  //     console.error(error)
  //     return res.status(500).send('Uploading files to Cloud Storage failed.')
  //   }
  // })
}

const allowedExtensions = ['image', 'video', 'audio', 'application/ogg']

const bucket = new Storage().bucket(GOOGLE_CLOUD_STORAGE_BUCKET)

function isExtensionAllowed(file: any) {
  for (const allowedExtension of allowedExtensions) {
    if (file.mimetype.startsWith(allowedExtension)) return true
  }
  return false
}

function uploadFileToCloudStorage(file: any) {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}-${sha128(file.originalname)}${path.extname(file.originalname)}`
    const blobStream = bucket.file(fileName).createWriteStream()

    blobStream.on('error', (err) => {
      reject(err)
    })

    blobStream.on('finish', () => {
      resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`)
    })

    blobStream.end(file.buffer)
    // blobStream.end(optimizeIfImage(file, 720))
  })
}

// async function optimizeIfImage(file: Express.Multer.File, height: number) {
//   if (file.mimetype.startsWith('image')) {
//     return await sharp(file.path)
//       .resize({ height })
//       .withMetadata() // 이미지의 exif 데이터 유지
//       .toBuffer()
//   }
// }
