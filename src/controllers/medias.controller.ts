import { NextFunction, Request, Response } from 'express'
import { handleUploadImage } from '~/utils/file'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await handleUploadImage(req)

  res.json({
    result
  })
}
