import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
config()

export const signToken = ({
  payload,
  secretOrPrivateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  secretOrPrivateKey: string
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

export const verifyToken = ({ token, secretOrPrivateKey }: { token: string; secretOrPrivateKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
      if (err) {
        throw reject(new ErrorWithStatus({ message: capitalize(err.message), status: HTTP_STATUS.UNAUTHORIZED }))
      }

      resolve(decoded as TokenPayload)
    })
  })
}
