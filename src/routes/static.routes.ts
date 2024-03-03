import express from 'express'
import { serveImageController } from '~/controllers/medias.controller'

const staticRouter = express.Router()

staticRouter.get('/image/:filename', serveImageController)

export default staticRouter
