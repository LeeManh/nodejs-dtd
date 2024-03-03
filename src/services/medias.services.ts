import path from 'path'
import sharp from 'sharp'
import { Request } from 'express'
import { getNameFromFullname, handleUploadSingleImage } from '~/utils/file'
import { UPLOAD_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
config()

class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameFromFullname(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)

    fs.unlinkSync(file.filepath) // remove the original file

    const linkImage = isProduction
      ? `${process.env.HOST}/medias/${newName}.jpg`
      : `http://localhost:${process.env.PORT}/medias/${newName}.jpg`

    return linkImage
  }
}

const mediasService = new MediasService()

export default mediasService
