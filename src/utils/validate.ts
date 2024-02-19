import express from 'express'
import { validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)

    const errors = validationResult(req)

    // if no errors, continue to the next middleware
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    // check if errors is not 422 then throw the error
    for (const field in errorsObject) {
      const { msg } = errorsObject[field]

      if (msg instanceof ErrorWithStatus && msg?.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }

      entityError.errors[field] = errorsObject[field]
    }

    // if status is 422, return the errors
    next(entityError)
  }
}

export default validate
