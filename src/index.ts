import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_DIR } from './constants/dir'

config()

const app = express()
const port = process.env.PORT || 4000

// Connect to MongoDB
databaseService.connect()

initFolder()

app.use('/static', express.static(UPLOAD_DIR))

// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())

// routes
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)

// Error handling middleware
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
