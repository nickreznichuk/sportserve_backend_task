import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dbConnect from './db'
import transactionRoutes from './routes/transaction'
import dotenv from 'dotenv'
dotenv.config()

dbConnect()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api', transactionRoutes)

export default app
