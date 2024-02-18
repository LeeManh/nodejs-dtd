import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()

// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())

app.use('/users', usersRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(1)

  res.status(400).json({ error: err.message })
})

// Connect to MongoDB
databaseService.connect()

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
