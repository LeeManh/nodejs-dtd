import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
config()

export const signToken = ({
  payload,
  secretOrPrivateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  secretOrPrivateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }

      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPrivateKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPrivateKey?: string
}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
      if (err) {
        throw reject(new ErrorWithStatus({ message: capitalize(err.message), status: HTTP_STATUS.UNAUTHORIZED }))
      }

      resolve(decoded)
    })
  })
}
