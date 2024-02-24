import { NextFunction, Request, Response } from 'express'
import userService from '~/services/users.services'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
import databaseService from '~/services/database.services'
import { TokenPayload } from '~/models/requests/User.request'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enum'

export const loginController = async (req: Request, res: Response) => {
  const user = (req as any).user as User
  const user_id = user._id as ObjectId

  const result = await userService.login(user_id.toString())

  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request, res: Response) => {
  const result = await userService.register(req.body)

  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const result = await userService.logout({ refresh_token: req.body.refresh_token })

  return res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS,
    result
  })
}

export const verifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  // if user not found
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  // if email already verified
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }

  const { access_token, refresh_token } = await userService.verifyEmail(user_id)

  return res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result: {
      access_token,
      refresh_token
    }
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userService.resendVerifyEmail(user_id)
  return res.json(result)
}
