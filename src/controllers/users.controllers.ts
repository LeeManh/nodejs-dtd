import { Request, Response } from 'express'
import userService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Login route' })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await userService.register({ email, password })

    return res.json({
      message: 'Register success',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}
