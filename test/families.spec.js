const app = require('../src/app')
const knex = require('knex')
const fixtures = require('./choreUp-fixtures')
const { expect } = require('chai')
const supertest = require('supertest')

describe('Families Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db('families').delete())

  afterEach('cleanup', () => db('families').delete())

  describe('GET /api/families/:familyId', () => {
    context('Given there are families in the database', () => {
      const testFamilies = fixtures.makeFamiliesArray()
      const testUsers = fixtures.makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      beforeEach('insert families', () => {
        return db
          .into('families')
          .insert(testFamilies)
      })

      it('responds with 200 and the specified family', () => {
        const familyId = 1
        const expectedFamily = testFamilies[familyId - 1]
        return supertest(app)
          .get(`/api/families/${familyId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedFamily)
      })
    })
  })
})