import express from 'express'
import cors from 'cors'

let devices = []
const rooms = []
const allowedStatus = ['RUNNING', 'STARTING', 'STOPPED']

const app = express()

app.use(cors())

app.get('/rooms', (req, res) => {
  res.send(rooms)
})

app.get('/devices', (req, res) => {
  res.send(devices)
})

app.get('/devices/:uuid', (req, res) => {
  const { uuid } = req.params
  const device = devices.find(d => d.uuid === uuid)
  if (!device) {
    return res.status(404).send({ error: `Device ${uuid} not found` })
  }
  res.send(device)
})

app.post('/rooms/:uuid/devices', (req, res) => {
  const roomUuid = req.params.uuid
  const deviceUuid = req.body && req.body.uuid
  if (!deviceUuid) {
    return res.status(400).send({ error: 'Expected device uuid' })
  }
  const room = rooms.find(r => r.uuid === roomUuid)
  if (!room) {
    return res.status(404).send({ error: `Roome ${roomUuid} not found` })
  }
  const device = devices.find(d => d.uuid === deviceUuid)
  if (!device) {
    return res.status(404).send({ error: `Device ${deviceUuid} not found` })
  }
  if (room.devices.some(d => d.uuid === deviceUuid)) {
    return res.status(422).send({
      error: `Device ${deviceUuid} is already in room ${roomUuid} (${
        room.label
      })`,
    })
  }
  room.devices.push(device)
})

app.put('/devices/:uuid/status', (req, res) => {
  const status = req.body
  if (!allowedStatus.includes(status)) {
    return res.status(400).send({ error: `Status ${status} is not allowed` })
  }
  const { uuid } = req.params
  const device = devices.find(d => d.uuid === uuid)
  if (!device) {
    return res.status(404).send({ error: `Device ${uuid} not found` })
  }
  device.status = status
})

app.delete('/devices/:uuid', (req, res) => {
  const { uuid } = req.params
  const device = devices.find(d => d.uuid === uuid)
  if (!device) {
    return res.status(404).send({ error: `Device ${uuid} not found` })
  }
  if (device.status !== 'STOPPED') {
    return res.status(422).send({
      error: `Only stopped devices can be removed, but ${uuid} is ${
        device.status
      }`,
    })
  }
  devices = devices.filter(d => d.uuid === uuid)
  for (const room of rooms) {
    room.devices = room.devices.filter(d => d.uuid === uuid)
  }
})

export default app
