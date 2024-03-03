import express from 'express'
import { serveImageController, serveVideoStreamController } from '~/controllers/medias.controller'

const staticRouter = express.Router()

staticRouter.get('/image/:filename', serveImageController)
staticRouter.get('/video-stream/:filename', serveVideoStreamController)

export default staticRouter
