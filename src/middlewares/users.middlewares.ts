import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validate'

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      // check required token
      if (!value) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }

      // decode token
      const decoded_forgot_password_token = await verifyToken({
        token: value,
        secretOrPrivateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
      })

      const { user_id } = decoded_forgot_password_token

      // find user by user_id
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

      if (user === null) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_FOUND,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }

      if (user.forgot_password_token !== value) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }

      req.decoded_forgot_password_token = decoded_forgot_password_token

      return true
    }
  }
}

export const loginValidator = checkSchema({
  email: {
    isEmail: {
      errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
    },
    trim: true,
    custom: {
      options: async (value, { req }) => {
        const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body?.password) })

        if (user === null) {
          throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
        }

        req.user = user
        return true
      }
    }
  },
  password: passwordSchema
})

export const registerValidator = checkSchema(
  {
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const emailExist = await userService.checkEmailExist(value)

          if (emailExist) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
          }

          return true
        }
      }
    },
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      },
      errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
    }
  },
  ['body']
)

export const accessTokenValidator = checkSchema(
  {
    authorization: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const accessToken = value?.split(' ')?.[1]

          if (!accessToken) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          const decoded_authorization = await verifyToken({
            token: accessToken,
            secretOrPrivateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
          })

          console.log('decoded_authorization', decoded_authorization)

          req.decoded_authorization = decoded_authorization

          return true
        }
      }
    }
  },
  ['headers']
)

export const refreshTokenValidator = checkSchema(
  {
    refresh_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          const [decoded_refresh_token, refresh_token] = await Promise.all([
            verifyToken({ token: value, secretOrPrivateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
            databaseService.refreshTokens.findOne({ token: value })
          ])

          if (!refresh_token) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          req.decoded_refresh_token = decoded_refresh_token

          return true
        }
      }
    }
  },
  ['body']
)

export const emailVerifyToken = checkSchema({
  email_verify_token: {
    trim: true,
    custom: {
      options: async (value, { req }) => {
        if (!value) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }

        const decoded_email_verify_token = await verifyToken({
          token: value,
          secretOrPrivateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
        })

        req.decoded_email_verify_token = decoded_email_verify_token

        return true
      }
    }
  }
})

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value
            })
            if (user === null) {
              throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)
