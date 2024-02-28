import express from 'express'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator,
  emailVerifyToken,
  forgotPasswordValidator,
  verifyForgotPasswordTokenValidator,
  resetPasswordValidator,
  verifiedUserValidator,
  updateMeValidator,
  followValidator,
  unFollowValidator,
  changePasswordValidator
} from '~/middlewares/users.middlewares'
import {
  loginController,
  registerController,
  logoutController,
  verifyEmailController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getProfileController,
  followController,
  unFollowController,
  changePasswordController
} from '~/controllers/users.controllers'
import validate from '~/utils/validate'
import { wrapRequestHandler } from '~/utils/handlers'
import { UpdateMeReqBody } from '~/models/requests/User.request'
import { filterMiddleware } from '~/middlewares/common.middlewares'
const router = express.Router()

router.post('/login', loginValidator, wrapRequestHandler(loginController))
router.post('/register', registerValidator, wrapRequestHandler(registerController))
router.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
router.post('/email-verify', emailVerifyToken, wrapRequestHandler(verifyEmailController))

/**
 * Description. Verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
router.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
router.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description. Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: {forgot_password_token: string}
 */
router.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */
router.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
router.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 */
router.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */
router.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description: Follow someone
 * Path: /:username
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { followed_user_id: string }
 */
router.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description: Follow someone
 * Path: /follow/user_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
router.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)

/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_password: string }
 */
router.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default router
