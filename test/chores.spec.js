const app = require('../src/app')
const knex = require('knex')
const fixtures = require('./choreUp-fixtures')
const { expect } = require('chai')
const supertest = require('supertest')

describe('Chores Endpoints', () => {
  let db 
  
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db('chores').delete())

  afterEach('cleanup', () => db('chores').delete())

  describe('GET /api/chores/:choreId', () => {
    context('Given there are chores in the database', () => {
      const testChores = fixtures.makeChoresArray()

      beforeEach('insert chores', () => {
        return db
          .into('chores')
          .insert(testChores)
      })

      it('responds with 200 and the specified chore', () => {
        const choreId = 1
        const expectedChore = testChores[choreId - 1]
        return supertest(app)
          .get(`/api/chores/${choreId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedChore)
      })
    })
  })

  describe('PATCH /api/chores/:choreId', () => {
    context('Given there are chores in the database', () => {
      const testChores = fixtures.makeChoresArray()
      const choreId = 1

      beforeEach('insert chores', () => {
        return db
          .into('chores')
          .insert(testChores)
      })

      it('responds with 204 and updates the db when all fields are provided', () =>{
        const updatedChore = {
          value: 30,
          status: 'In Process',
          comments: "Test update for chore"
        }
        const expectedChore = {
          ...testChores[choreId -1],
          ...updatedChore
        }
        return supertest(app)
          .patch(`/api/chores/${choreId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedChore)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/chores/${choreId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedChore)
          )
      })

      it('responds with 204 and updates the db when some fields are provided', () =>{
        const updatedChore = {
          value: 30,
        }
        const expectedChore = {
          ...testChores[choreId -1],
          ...updatedChore
        }
        return supertest(app)
          .patch(`/api/chores/${choreId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedChore)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/chores/${choreId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedChore)
          )
      })
    })
  })
})