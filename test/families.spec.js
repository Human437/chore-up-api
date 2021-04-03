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

  before('cleanup', () => db('users').delete())
  before('cleanup', () => db('families').delete())

  afterEach('cleanup', () => db('families').delete())
  afterEach('cleanup', () => db('users').delete())

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

  describe('PATCH /api/families/:familyId', () => {
    context('Given there are families in the database', () => {
      const testFamilies = fixtures.makeFamiliesArray()
      const testUsers = fixtures.makeUsersArray()
      const familyId = 1

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

      it('responds with 204 and updates the db when all fields are provided', () =>{
        const updatedFamily = {
          admin: 2,
          code_to_join:"test"
        }
        const expectedFamily = {
          ...testFamilies[familyId -1],
          ...updatedFamily
        }
        return supertest(app)
          .patch(`/api/families/${familyId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedFamily)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/families/${familyId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedFamily)
          )
      })

      it('responds with 204 and updates the db when some fields are provided', () =>{
        const updatedFamily = {
          code_to_join:"test"
        }
        const expectedFamily = {
          ...testFamilies[familyId -1],
          ...updatedFamily
        }
        return supertest(app)
          .patch(`/api/families/${familyId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedFamily)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/families/${familyId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedFamily)
          )
      })
    })
  })
})