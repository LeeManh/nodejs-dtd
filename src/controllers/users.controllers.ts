import { NextFunction, Request, Response } from 'express'
import userService from '~/services/users.services'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
import databaseService from '~/services/database.services'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordReqBody,
  GetProfileReqParams,
  ResetPasswordReqBody,
  TokenPayload,
  UnFollowReqParams,
  VerifyForgotPasswordReqBody
} from '~/models/requests/User.request'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enum'
import { ParamsDictionary } from 'express-serve-static-core'
import { pick } from 'lodash'
import { body } from 'express-validator'

export const loginController = async (req: Request, res: Response) => {
  const user = (req as any).user as User
  const user_id = user._id as ObjectId

  const result = await userService.login({
    user_id: user_id.toString(),
    verify: user.verify
  })

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

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  const result = await userService.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify
  })
  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await userService.resetPassword(user_id, password)
  return res.json(result)
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await userService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}

export const updateMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const user = await userService.updateMe(user_id, req.body)

  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result: user
  })
}

export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response, next: NextFunction) => {
  const { username } = req.params

  const user = await userService.getProfile(username)

  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result: user
  })
}

export const followController = async (
  req: Request<ParamsDictionary, any, FollowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const { followed_user_id } = req.body

  const result = await userService.follow(user_id, followed_user_id)

  return res.json(result)
}

export const unFollowController = async (req: Request<UnFollowReqParams>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { user_id: followed_user_id } = req.params

  const result = await userService.unFollow(user_id, followed_user_id)

  return res.json(result)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password } = req.body

  const result = await userService.changePassword(user_id, password)

  return res.json(result)
}
