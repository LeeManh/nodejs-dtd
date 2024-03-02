import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import _ from 'lodash'
import path from 'path'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  // src/uploads
  const uploadDir = path.resolve('uploads')

  const form = formidable({ uploadDir, maxFiles: 1, keepExtensions: true, maxFileSize: 300 * 1024 })

  form.parse(req, (err, fields, files) => {
    if (err) {
      throw err
    }
    res.json({ fields, files })
  })

  // return res.json({
  //   message: 'Image uploaded successfully'
  // })
}
