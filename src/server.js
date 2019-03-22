import express from 'express'
import cors from 'cors'
import httpError from './httpError'
import { authenticate, errorHandler } from './middlewares'

const rooms = [
  {
    uuid: 'b84bdc5f-551e-4e2d-a382-2c0f743b6c78',
    label: 'Hedy Lamarr',
    floor: 8,
  },
  {
    uuid: 'ebc2d8c3-d883-4b08-8b63-770f7d1c359c',
    label: 'Mary Shelley',
    floor: 8,
  },
  {
    uuid: '7681fba7-15a1-4327-95f8-1d54287406aa',
    label: 'Tommy Flowers',
    floor: 8,
  },
  {
    uuid: 'e1adbf5b-3dbc-429c-9e92-2bcadf774077',
    label: 'Ziggy Stardust',
    floor: 8,
  },
  {
    uuid: 'ed14fd6c-eac9-4dac-9695-aecdf24fcc78',
    label: 'Ada Lovelace',
    floor: 9,
  },
  {
    uuid: '83fc7f19-ae84-41b3-b8d2-1c7696e54f4d',
    label: 'John Lennon',
    floor: 9,
  },
  {
    uuid: '65345fbe-7bd1-4729-9cfe-eb74194f6163',
    label: 'Tim Barners-Lee',
    floor: 9,
  },
]
let devices = [
  {
    uuid: '606ed577-3f0a-496d-b2bb-c0d90877623c',
    status: 'RUNNING',
    responseTime: 20,
    room: rooms[0],
    temperature: 18,
    humidity: 15,
  },
  {
    uuid: 'fbb400cb-6854-4d2c-8219-62ed1cfbc774',
    status: 'RUNNING',
    responseTime: 20,
    room: rooms[1],
    temperature: 18,
    humidity: 15,
  },
  {
    uuid: '8061a1df-09f8-447c-95e0-b944d36915b4',
    status: 'RUNNING',
    responseTime: 20,
    room: rooms[2],
    temperature: 18,
    humidity: 15,
  },
  {
    uuid: '1e358a48-3df1-4677-9746-a569efb3aec6',
    status: 'RUNNING',
    responseTime: 20,
    room: rooms[3],
    temperature: 18,
    humidity: 15,
  },
  {
    uuid: '71ad81ce-959d-4143-b5f5-917d0c6a4415',
    status: 'RUNNING',
    responseTime: 20,
    room: rooms[4],
    temperature: 18,
    humidity: 15,
  },
  {
    uuid: '15a916cc-a03f-4afd-80cf-d702b71549e4',
    status: 'STOPPED',
    responseTime: 0,
    room: rooms[5],
    temperature: 0,
    humidity: 0,
  },
  {
    uuid: 'f4087b3e-4893-4d62-a11c-27b3ce4e6307',
    status: 'RUNNING',
    responseTime: 20,
    room: rooms[1],
    temperature: 18,
    humidity: 15,
  },
  {
    uuid: 'c77b56ae-e25e-4596-a273-150fd4295df7',
    status: 'RUNNING',
    responseTime: 20,
    room: null,
    temperature: 18,
    humidity: 15,
  },
  {
    uuid: '0a44aecf-95e7-4182-8f70-83592c8c7ecd',
    status: 'STOPPED',
    responseTime: 0,
    room: null,
    temperature: 0,
    humidity: 0,
  },
]
const allowedStatus = ['RUNNING', 'STARTING', 'STOPPED']

function loadDevice(uuid) {
  const device = devices.find(d => d.uuid === uuid)
  if (!device) {
    throw httpError(404, `Device ${uuid} not found`)
  }
  return device
}

const app = express()

app.use(cors())

app.get('/rooms', (req, res) => {
  res.send(
    rooms.map(r => ({
      ...r,
      devices: devices.filter(d => d.room === r),
    }))
  )
})

app.get('/devices', (req, res) => {
  res.send(devices)
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
    return res.status(400).send({ error: 'Expected device uuid' })
  }
  const room = rooms.find(r => r.uuid === roomUuid)
  if (!room) {
    return res.status(404).send({ error: `Roome ${roomUuid} not found` })
  }
  const device = loadDevice(deviceUuid)
  if (room.devices.some(d => d.uuid === deviceUuid)) {
    return res.status(422).send({
      error: `Device ${deviceUuid} is already in room ${roomUuid} (${
        room.label
      })`,
    })
  }
  room.devices.push(device)
})

app.put('/devices/:uuid/status', authenticate, (req, res) => {
  const status = req.body
  if (!allowedStatus.includes(status)) {
    return res.status(400).send({ error: `Status ${status} is not allowed` })
  }
  const { uuid } = req.params
  const device = loadDevice(uuid)
  device.status = status
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
  devices = devices.filter(d => d.uuid === uuid)
})

app.use(errorHandler)

export default app
