const app = require('../src/app')
const knex = require('knex')
const fixtures = require('./choreUp-fixtures')
const { expect } = require('chai')
const supertest = require('supertest')

describe('Family_Members Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db('family_members').delete())
  before('cleanup', () => db('users').delete())
  before('cleanup', () => db('families').delete())

  afterEach('cleanup', () => db('family_members').delete())
  afterEach('cleanup', () => db('users').delete())
  afterEach('cleanup', () => db('families').delete())

    describe('GET /api/family_members/:family_memberId', () => {
    context('Given there are family_members in the database', () => {
      const testFamily_Members = fixtures.makeFamily_MembersArray()
      const testUsers = fixtures.makeUsersArray()
      const testFamilies = fixtures.makeFamiliesArray()

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

      beforeEach('insert family_members', () => {
        return db
          .into('family_members')
          .insert(testFamily_Members)
      })

      it('responds with 200 and the specified family_member', () => {
        const family_memberId = 1
        const expectedFamily_Members = testFamily_Members[family_memberId - 1]
        return supertest(app)
          .get(`/api/family_members/${family_memberId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedFamily_Members)
      })
    })
  })
})