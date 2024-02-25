import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface TokenPayload extends JwtPayload {
  token_type: TokenType
  user_id: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}
