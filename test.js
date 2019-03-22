import test from 'ava'
import request from 'supertest'
import server from './src/server'

const token = 'MRBW6ZDFEBBGC43FGMZA'

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

test('Can stop a RUNNING device', async t => {
  const app = request(server)
  const uuid = '606ed577-3f0a-496d-b2bb-c0d90877623c'
  const res = await app
    .put(`/devices/${uuid}/status`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'STOPPED' })

  t.is(res.status, 200)
  t.is(res.body.uuid, uuid)
  t.is(res.body.status, 'STOPPED')
})

test('Can start a STOPPED device', async t => {
  const app = request(server)
  const uuid = '15a916cc-a03f-4afd-80cf-d702b71549e4'
  const res = await app
    .put(`/devices/${uuid}/status`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'RUNNING' })

  t.is(res.status, 200)
  t.is(res.body.uuid, uuid)
  t.is(res.body.status, 'RUNNING')
})

test('Prevent invalid status', async t => {
  const app = request(server)
  const uuid = '15a916cc-a03f-4afd-80cf-d702b71549e4'
  const res = await app
    .put(`/devices/${uuid}/status`)
    .set('Authorization', `Bearer ${token}`)
    .send({ status: 'FOOBAR' })

  t.is(res.status, 400)
})
