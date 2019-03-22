import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import httpError from './httpError'
import { authenticate, errorHandler } from './middlewares'
import { rooms, devices } from './data'

const allowedStatus = ['RUNNING', 'STOPPED']

function loadDevice(uuid) {
  const device = devices.find(d => d.uuid === uuid)
  if (!device) {
    throw httpError(404, `Device ${uuid} not found`)
  }
  return device
}

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.get('/rooms', (req, res) => {
  res.send(
    rooms.map(r => ({
      ...r,
      devices: devices.filter(d => d.room === r).map(({ room, ...d }) => d),
    }))
  )
})

app.get('/devices', (req, res) => {
  res.send(devices.filter(d => !d.deleted))
})

app.get('/devices/:uuid', (req, res) => {
  const { uuid } = req.params
  const device = loadDevice(uuid)
  res.send(device)
})

app.post('/rooms/:uuid/devices', authenticate, (req, res) => {
  const roomUuid = req.params.uuid
  const deviceUuid = req.body && req.body.uuid
  if (!deviceUuid) {
    return res
      .status(400)
      .send({ error: 'Expected device uuid as part of the body' })
  }
  const room = rooms.find(r => r.uuid === roomUuid)
  if (!room) {
    return res.status(404).send({ error: `Room ${roomUuid} not found` })
  }
  const device = loadDevice(deviceUuid)
  if (device.room === room) {
    return res.status(422).send({
      error: `Device ${deviceUuid} is already in room ${roomUuid} (${
        room.label
      })`,
    })
  }
  device.room = room
  res.send(room)
})

app.put('/devices/:uuid/status', authenticate, (req, res) => {
  const status = req.body && req.body.status
  if (!allowedStatus.includes(status)) {
    return res.status(400).send({ error: `Status ${status} is not allowed` })
  }
  const { uuid } = req.params
  const device = loadDevice(uuid)
  device.status = status
  res.send(device)
})

app.delete('/devices/:uuid', authenticate, (req, res) => {
  const { uuid } = req.params
  const device = loadDevice(uuid)
  if (device.status !== 'STOPPED') {
    return res.status(422).send({
      error: `Only stopped devices can be removed, but ${uuid} is ${
        device.status
      }`,
    })
  }
  device.deleted = true
  device.room = null
  res.sendStatus(204)
})

app.use(errorHandler)

export default app
