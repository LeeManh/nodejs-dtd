import { Request, Response } from 'express'
import userService from '~/services/users.services'
import { checkSchema } from 'express-validator'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Login route' })
}

export const registerController = async (req: Request, res: Response) => {
  const result = await userService.register(req.body)

  return res.json({
    message: 'Register success',
    result
  })
}
