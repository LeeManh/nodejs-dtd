import express from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
import validate from '~/utils/validate'
const router = express.Router()

router.post('/login', loginValidator, loginController)
router.post('/register', validate(registerValidator), registerController)

export default router
