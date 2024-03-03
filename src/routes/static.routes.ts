import express from 'express'
import { serveImageController, serveVideoController } from '~/controllers/medias.controller'

const staticRouter = express.Router()

staticRouter.get('/image/:filename', serveImageController)
staticRouter.get('/video/:filename', serveVideoController)

export default staticRouter
