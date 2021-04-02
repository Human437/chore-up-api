const app = require('../src/app')
const knex = require('knex')
const fixtures = require('./choreUp-fixtures')
const { expect } = require('chai')
const supertest = require('supertest')

describe('Users Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db('users').delete())

  afterEach('cleanup', () => db('users').delete())

  describe('GET /api/users/:userId', () => {
    context('Given there are users in the database', () => {
      const testUsers = fixtures.makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 200 and the specified user', () => {
        const userId = 1
        const expectedUser = testUsers[userId - 1]
        return supertest(app)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedUser)
      })
    })
  })
})