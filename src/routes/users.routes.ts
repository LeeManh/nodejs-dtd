import express from 'express'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator
} from '~/middlewares/users.middlewares'
import { loginController, registerController, logoutController } from '~/controllers/users.controllers'
import validate from '~/utils/validate'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

router.post('/login', validate(loginValidator), wrapRequestHandler(loginController))
router.post('/register', validate(registerValidator), wrapRequestHandler(registerController))
router.post(
  '/logout',
  validate(accessTokenValidator),
  validate(refreshTokenValidator),
  wrapRequestHandler(logoutController)
)
export default router
