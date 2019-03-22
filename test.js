import test from 'ava'
import request from 'supertest'
import server from './src/server'

test('Get all devices', async t => {
  const app = request(server)
  const res = await app.get('/devices')
  t.is(res.body.length, 9)
})

test('Get all rooms', async t => {
  const app = request(server)
  const res = await app.get('/rooms')
  t.is(res.body.length, 7)
})
