import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()

// Connect to MongoDB
databaseService.connect()

// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())

app.use('/users', usersRouter)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
