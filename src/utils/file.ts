import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { isNil } from 'lodash'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_IMAGE_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // mục đích là để tạo folder nested
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    // maxFileSize: 300 * 1024, // 300KB
    // maxTotalFileSize: 300 * 1024 * 4, // 300KB * 4
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      const valid = !!mimetype?.includes('image')

      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isNil(files?.images)) {
        reject(new Error('No file uploaded'))
      }

      resolve(files.images as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1
    // keepExtensions: true
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      if (isNil(files?.videos)) {
        reject(new Error('No file uploaded'))
      }

      ;(files.videos as File[]).forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
      })

      resolve(files.videos as File[])
    })
  })
}

export const getNameFromFullname = (fullname: string) => {
  const nameArr = fullname.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtension = (fullname: string) => {
  const nameArr = fullname.split('.')
  return nameArr[nameArr.length - 1]?.toLowerCase()
}
