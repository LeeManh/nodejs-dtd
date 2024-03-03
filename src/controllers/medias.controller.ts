import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import mediasService from '~/services/medias.services'
import fs from 'fs'
import mime from 'mime'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.uploadImage(req)

  res.json({
    result
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.uploadVideo(req)

  res.json({
    result
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { filename } = req.params

  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, filename), (err) => {
    if (err) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: USERS_MESSAGES.FILE_NOT_FOUND
      })
    }
  })
}

export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range

  if (!range) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.INVALID_RANGE
    })
  }

  const { filename } = req.params

  // get video path from filename
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, filename)

  // get video size
  const videoSize = fs.statSync(videoPath).size

  // parse range
  const CHUNK_SIZE = 10 ** 6 // 1MB

  const start = Number((range as string).replace(/\D/g, ''))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'

  // create headers
  const headers = {
    'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }

  // HTTP Status 206 for Partial Content
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}
