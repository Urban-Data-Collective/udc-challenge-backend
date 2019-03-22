import test from 'ava'
import request from 'supertest'
import server from './src/server'

test('Get all devices', async t => {
  const app = request(server)
  const res = await app.get('/devices')
  const devices = res.body
  t.is(devices.length, 9)
})

test('Get all rooms', async t => {
  const app = request(server)
  const res = await app.get('/rooms')
  const rooms = res.body
  t.is(res.body.length, 7)
  t.deepEqual(rooms[0].devices[0], {
    humidity: 15,
    responseTime: 20,
    status: 'RUNNING',
    temperature: 18,
    uuid: '606ed577-3f0a-496d-b2bb-c0d90877623c',
  })
})
