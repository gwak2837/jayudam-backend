import sharp from 'sharp'
import { Storage } from '@google-cloud/storage'
import { type Express } from 'express'
import Multer from 'multer'
import path from 'node:path'

import { sha128 } from '../utils'
import { googleCloudStorageBucket } from '../utils/constants'

// https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-storage
export function setUploadingFiles(app: Express) {
  app.post('/upload', multer.array('file', 10), async (req, res) => {
    const files = req.files as Express.Multer.File[]
    if (!files.length) return res.status(400).send('No file uploaded.')

    for (const file of files) {
      if (!isAllowedExtension(file))
        return res
          .status(400)
          .send(`There is a file with unauthorized extension. File name: ${file.originalname}`)
    }

    try {
      const imageUrls = await Promise.all(files.map((file) => uploadFileToCloudStorage(file)))
      return res.status(200).json({ imageUrls })
    } catch (error) {
      console.error(error)
      return res.status(500).send('Uploading files to Cloud Storage failed.')
    }
  })
}

const allowedExtensions = ['image', 'video', 'audio', 'application/ogg']

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10_000_000, // no larger than 10MB
  },
})

const bucket = new Storage().bucket(googleCloudStorageBucket)

function isAllowedExtension(file: Express.Multer.File) {
  for (const allowedExtension of allowedExtensions) {
    if (file.mimetype.startsWith(allowedExtension)) return true
  }
  return false
}

function uploadFileToCloudStorage(file: Express.Multer.File) {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}-${sha128(file.originalname)}${path.extname(file.originalname)}`
    const blobStream = bucket.file(fileName).createWriteStream()

    blobStream.on('error', (err) => {
      reject(err)
    })

    blobStream.on('finish', () => {
      resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`)
    })

    blobStream.end(optimizeIfImage(file, 720))
  })
}

async function optimizeIfImage(file: Express.Multer.File, height: number) {
  if (file.mimetype.startsWith('image')) {
    return await sharp(file.path)
      .resize({ height })
      .withMetadata() // 이미지의 exif 데이터 유지
      .toBuffer()
  }
}
