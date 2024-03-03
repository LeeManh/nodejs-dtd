import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import mediasService from '~/services/medias.services'

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

export const serveVideoController = (req: Request, res: Response, next: NextFunction) => {
  const { filename } = req.params

  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, filename), (err) => {
    if (err) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: USERS_MESSAGES.FILE_NOT_FOUND
      })
    }
  })
}
