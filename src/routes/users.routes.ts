import express from 'express'
import { loginValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
const router = express.Router()

router.post('/login', loginValidator, loginController)
router.post('/register', registerController)

export default router
