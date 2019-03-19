import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/foo', (req, res) => {
  res.send({ foo: 'bar' })
})

export default app
