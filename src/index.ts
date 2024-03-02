import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
const app = express()

// Connect to MongoDB
databaseService.connect()

// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())

// routes
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)

// Error handling middleware
app.use(defaultErrorHandler)

app.listen(4000, () => {
  console.log('Server is running on port 4000')
})
