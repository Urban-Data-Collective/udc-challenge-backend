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

test('Can delete a device', async t => {
  const app = request(server)
  const uuid = '0a44aecf-95e7-4182-8f70-83592c8c7ecd'
  const res = await app
    .delete(`/devices/${uuid}`)
    .set('Authorization', `Bearer ${token}`)

  t.is(res.status, 204)
})

test('Cannot delete a running device', async t => {
  const app = request(server)
  const uuid = '15a916cc-a03f-4afd-80cf-d702b71549e4'
  const res = await app
    .delete(`/devices/${uuid}`)
    .set('Authorization', `Bearer ${token}`)

  t.is(res.status, 422)
})

test('Wrong token show error', async t => {
  const app = request(server)
  const uuid = '15a916cc-a03f-4afd-80cf-d702b71549e4'
  const res = await app
    .delete(`/devices/${uuid}`)
    .set('Authorization', `Bearer WRONGTOKEN`)

  t.is(res.status, 401)
  t.is(res.body.error, 'Invalid token')
})

test('No token show error', async t => {
  const app = request(server)
  const uuid = '15a916cc-a03f-4afd-80cf-d702b71549e4'
  const res = await app.delete(`/devices/${uuid}`)

  t.is(res.status, 401)
  t.is(res.body.error, 'Authentication needed to access the resource')
})

test('Can add device to room', async t => {
  const app = request(server)
  const roomUuid = '65345fbe-7bd1-4729-9cfe-eb74194f6163'
  const deviceUuid = 'c77b56ae-e25e-4596-a273-150fd4295df7'
  const res = await app
    .post(`/rooms/${roomUuid}/devices`)
    .set('Authorization', `Bearer ${token}`)
    .send({ uuid: deviceUuid })

  t.is(res.status, 200)
  t.deepEqual(res.body, {
    floor: 9,
    label: 'Tim Barners-Lee',
    uuid: '65345fbe-7bd1-4729-9cfe-eb74194f6163',
  })
})

test('Cannot add device to room is already in', async t => {
  const app = request(server)
  const roomUuid = 'b84bdc5f-551e-4e2d-a382-2c0f743b6c78'
  const deviceUuid = '606ed577-3f0a-496d-b2bb-c0d90877623c'
  const res = await app
    .post(`/rooms/${roomUuid}/devices`)
    .set('Authorization', `Bearer ${token}`)
    .send({ uuid: deviceUuid })

  t.is(res.status, 422)
  t.is(
    res.body.error,
    `Device ${deviceUuid} is already in room ${roomUuid} (Hedy Lamarr)`
  )
})
