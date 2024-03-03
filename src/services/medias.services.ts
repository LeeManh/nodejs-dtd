import path from 'path'
import sharp from 'sharp'
import { Request } from 'express'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'
config()

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)

        // remove cache
        sharp.cache(false)

        // reduce image size and save to new path
        await sharp(file.filepath).jpeg().toFile(newPath)

        // remove old file
        fs.unlinkSync(file.filepath)

        // return new path
        const linkImage = isProduction
          ? `${process.env.HOST}/static/image/${newName}.jpg`
          : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`

        return {
          url: linkImage,
          type: MediaType.Image
        }
      })
    )

    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        type: MediaType.Video
      }
    })

    return result
  }
}

const mediasService = new MediasService()

export default mediasService
