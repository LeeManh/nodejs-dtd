import { Request, Response } from 'express'
import userService from '~/services/users.services'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'

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
