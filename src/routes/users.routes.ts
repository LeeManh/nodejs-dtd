import express from 'express'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator,
  emailVerifyToken
} from '~/middlewares/users.middlewares'
import {
  loginController,
  registerController,
  logoutController,
  verifyEmailController,
  resendVerifyEmailController
} from '~/controllers/users.controllers'
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
router.post('/email-verify', validate(emailVerifyToken), wrapRequestHandler(verifyEmailController))

/**
 * Description. Verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
router.post('/resend-verify-email', validate(accessTokenValidator), wrapRequestHandler(resendVerifyEmailController))

export default router
