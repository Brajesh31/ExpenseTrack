import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

import { transactionRouter } from '../routes/transaction.route.js'

app.use('/api', transactionRouter)

export {app}