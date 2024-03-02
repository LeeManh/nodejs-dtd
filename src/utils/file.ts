import { Request } from 'express'
import formidable, { errors as formidableErrors } from 'formidable'

import fs from 'fs'
import { isNil } from 'lodash'
import path from 'path'
export const initFolder = () => {
  const uploadFolderPath = path.resolve('uploads')
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // mục đích là để tạo folder nested
    })
  }
}

export const handleUploadImage = async (req: Request) => {
  const uploadDir = path.resolve('uploads')

  const form = formidable({
    uploadDir,
    maxFiles: 1,
    keepExtensions: true,
    // maxFileSize: 300 * 1024
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      const valid = !!mimetype?.includes('image')

      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isNil(files?.image)) {
        reject(new Error('No file uploaded'))
      }

      resolve(files)
    })
  })
}
