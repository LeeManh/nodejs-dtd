import express from 'express'
import { loginValidator } from '~/middlewares/users.middlewares'
import { loginController } from '~/controllers/users.controllers'
const router = express.Router()

router.post('/login', loginValidator, loginController)

export default router
