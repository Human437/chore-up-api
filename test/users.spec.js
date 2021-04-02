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
  describe('PATCH /api/users/:userId', () => {
    context('Given there are users in the database', () => {
      const testUsers = fixtures.makeUsersArray()
      const userId = 1

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 204 and updates the db when all fields are provided', () =>{
        const updatedUser = {
          name: "Ryan",
          level: 10,
          xp_till_level_up: 1000,
          email: "test@test.com",
          hashed_password: "FakePassword"
        }
        const expectedUser = {
          ...testUsers[userId -1],
          ...updatedUser
        }
        return supertest(app)
          .patch(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedUser)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users/${userId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUser)
          )
      })

      it('responds with 204 and updates the db when some fields are provided', () =>{
        const updatedUser = {
          name: "Ryan",
        }
        const expectedUser = {
          ...testUsers[userId -1],
          ...updatedUser
        }
        return supertest(app)
          .patch(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedUser)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users/${userId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUser)
          )
      })
    })
  })
  describe('DELETE /api/users/:userId', () => {
    context(`Given that thers are users in the db to delete`, () => {
      const testUsers = fixtures.makeUsersArray()
      const userId = 1

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 204 and deletes the specified user', () => {
        return supertest(app)
          .delete(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res => 
            supertest(app)  
              .get(`/api/users/${userId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(404,{error: {message: `User doesn't exist`}})
          )
      })
    })
  })
})