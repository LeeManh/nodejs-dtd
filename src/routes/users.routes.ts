import express from 'express'
import { loginValidator, registerValidator, accessTokenValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
import validate from '~/utils/validate'
import { wrapRequestHandler } from '~/utils/handlers'
const router = express.Router()

router.post('/login', validate(loginValidator), wrapRequestHandler(loginController))
router.post('/register', validate(registerValidator), wrapRequestHandler(registerController))
router.post(
  '/logout',
  validate(accessTokenValidator),
  wrapRequestHandler((req, res) => res.json({ message: 'Logout' }))
)
export default router
