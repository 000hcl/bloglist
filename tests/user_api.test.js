const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUser = {
  username: 'digiorno',
  name: 'John DiGiorno'
}

describe('when there is an existing user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secretingredientis?', 10)
    const user = new User({
      username: 'digiorno',
      name: 'John DiGiorno',
      passwordHash
    })
    await user.save()
  })

  test('user is returned', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body[0].username, initialUser.username)
    assert.strictEqual(response.body[0].name, initialUser.name)
  })

  describe('creating a new user', () => {
    test('with missing name fails', async () => {
      const user = { name: 'Jeremy', password: 'secretofpeter' }
      const result = await api.post('/api/users').send(user).expect(400)
      assert(result.body.error.includes('Path `username` is required.'))

      const dbUsers = await api.get('/api/users')
      assert(dbUsers.body.length === 1)

    })
    test('with missing password fails', async () => {
      const user = { name: 'Jeremy', username: 'jeremy1982' }
      const result = await api.post('/api/users').send(user).expect(400)
      assert(result.body.error.includes('password is required'))

      const dbUsers = await api.get('/api/users')
      assert(dbUsers.body.length === 1)

    })
    test('with username too short fails', async () => {
      const user = { name: 'Jeremy', username: 'j', password: 'secretofpeter' }
      const result = await api.post('/api/users').send(user).expect(400)
      assert(result.body.error.includes('shorter than the minimum allowed length'))

      const dbUsers = await api.get('/api/users')
      assert(dbUsers.body.length === 1)
    })
    test('with password too short fails', async () => {
      const user = { name: 'Jeremy', username: 'jeremy1982', password: 's' }
      const result = await api.post('/api/users').send(user).expect(400)
      assert(result.body.error.includes('password must be at least 3 characters long'))

      const dbUsers = await api.get('/api/users')
      assert(dbUsers.body.length === 1)
    })
    test('with non-unique username fails', async () => {
      const user = { name: 'Jeremy', username: 'digiorno', password: 'secretofpeter' }
      const result = await api.post('/api/users').send(user).expect(400)
      assert(result.body.error.includes('expected `username` to be unique'))

      const dbUsers = await api.get('/api/users')
      assert(dbUsers.body.length === 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})