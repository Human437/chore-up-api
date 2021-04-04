const app = require('../src/app')
const knex = require('knex')
const fixtures = require('./choreUp-fixtures')
const { expect } = require('chai')
const supertest = require('supertest')

describe('User_Chores Endpoints', () => {
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
  before('cleanup', () => db('chores').delete())

  afterEach('cleanup', () => db('users').delete())
  afterEach('cleanup', () => db('chores').delete())

  describe('GET /api/user_chores/:user_choreId', () => {
    context('Given there are user_chores in the database', () => {
      const testUser_Chores = fixtures.makeUser_ChoresArray()
      const testUsers = fixtures.makeUsersArray()
      const testChores = fixtures.makeChoresArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      beforeEach('insert chores', () => {
        return db
          .into('chores')
          .insert(testChores)
      })

      beforeEach('insert user_chores', () => {
        return db
          .into('user_chores')
          .insert(testUser_Chores)
      })

      it('responds with 200 and the specified user_chore', () => {
        const user_choreId = 1
        const expectedUser_Chores = testUser_Chores[user_choreId - 1]
        return supertest(app)
          .get(`/api/user_chores/${user_choreId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedUser_Chores)
      })
    })
  })
})