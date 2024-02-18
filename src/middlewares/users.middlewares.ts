import { NextFunction, Request, Response } from 'express'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Username and password are required' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  }

  next()
}
