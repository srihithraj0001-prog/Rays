const request = require('supertest')
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

// ensure DB is migrated before tests
beforeAll(()=>{
  execSync('node src/db/init.js', {cwd: path.join(__dirname,'..')})
})

describe('Auth and protected endpoints', ()=>{
  let server
  beforeAll(()=>{ server = require('../src/server') })

  test('register -> login -> protected bookmark isolation', async ()=>{
    const app = request('http://localhost:4000')
    // register user A
    const ua = { name: 'User A', email: 'a@example.com', password: 'Password1' }
    let res = await app.post('/api/auth/register').send(ua)
    expect(res.statusCode).toBe(200)
    // logout (session started), then login
    await app.post('/api/auth/logout')
    res = await app.post('/api/auth/login').send({ email: ua.email, password: ua.password })
    expect(res.statusCode).toBe(200)
    const cookie = res.headers['set-cookie']
    expect(cookie).toBeDefined()
    // create bookmark
    res = await app.post('/api/bookmarks').set('Cookie', cookie).send({ type:'question', ref_id:'TEST-Q-1' })
    expect(res.statusCode).toBe(200)
    // register user B
    const ub = { name: 'User B', email: 'b@example.com', password: 'Password1' }
    res = await app.post('/api/auth/register').send(ub)
    expect(res.statusCode).toBe(200)
    // login as B
    await app.post('/api/auth/logout')
    res = await app.post('/api/auth/login').send({ email: ub.email, password: ub.password })
    const cookieB = res.headers['set-cookie']
    // get bookmarks as B -> should not see A's bookmark
    res = await app.get('/api/bookmarks').set('Cookie', cookieB)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    // ensure none of bookmarks have ref_id TEST-Q-1
    const found = res.body.data.find(b=> b.ref_id === 'TEST-Q-1')
    expect(found).toBeUndefined()
  })
})
