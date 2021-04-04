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
  describe('PATCH /api/family_members/:family_memberId', () => {
    context('Given there are family_members in the database', () => {
      const testFamily_Members = fixtures.makeFamily_MembersArray()
      const testUsers = fixtures.makeUsersArray()
      const testFamilies = fixtures.makeFamiliesArray()
      const family_memberId = 1

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

      it('responds with 204 and updates the db when all fields are provided', () =>{
        const updatedFamily_Member = {
          user_id: 3,
          family_id: 1
        }
        const expectedFamily_Member = {
          ...testFamily_Members[family_memberId -1],
          ...updatedFamily_Member
        }
        return supertest(app)
          .patch(`/api/family_members/${family_memberId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedFamily_Member)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/family_members/${family_memberId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedFamily_Member)
          )
      })

      it('responds with 204 and updates the db when some fields are provided', () =>{
        const updatedFamily_Member = {
          user_id: 3
        }
        const expectedFamily_Member = {
          ...testFamily_Members[family_memberId -1],
          ...updatedFamily_Member
        }
        return supertest(app)
          .patch(`/api/family_members/${family_memberId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(updatedFamily_Member)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/family_members/${family_memberId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedFamily_Member)
          )
      })
    })
  })
  describe('DELETE /api/family_members/:family_memberId', () => {
    context(`Given that thers are family_members in the db to delete`, () => {
      const testFamily_Members = fixtures.makeFamily_MembersArray()
      const testUsers = fixtures.makeUsersArray()
      const testFamilies = fixtures.makeFamiliesArray()
      const family_memberId = 1

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

      it('responds with 204 and deletes the specified family_member', () => {
        return supertest(app)
          .delete(`/api/family_members/${family_memberId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res => 
            supertest(app)  
              .get(`/api/family_members/${family_memberId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(404,{error: {message: `Family_Member doesn't exist`}})
          )
      })
    })
  })
  describe('POST /api/family_members', () => {
    context(`Given that all the fields are provided`, () => {
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

      const newFamily_Member = {
        user_id: 3,
        family_id: 1
      }
      it('Adds a new family_member and returns with 201 and the family_member just added', () => {
        return supertest(app)
        .post('/api/family_members/')
        .send(newFamily_Member)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.admin).to.eql(newFamily_Member.admin)
          expect(res.body.code_to_join).to.eql(newFamily_Member.code_to_join)
        })
        .then(res =>
          supertest(app)  
            .get(`/api/family_members/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        )
      })
    })
  })
  describe('GET /api/family_members/family/:familyId', () => {
    context('Given that the user exists and has corresponding chores', () => {
      const testFamily_Members = fixtures.makeFamily_MembersArray()
      const testUsers = fixtures.makeUsersArray()
      const testFamilies = fixtures.makeFamiliesArray()
      const family_memberId = 1

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
      it('Returns an array of objects containing all the family members corresponding to the specified family', () => {
        const family_id = 1
        const expectedMembers = fixtures.makeReturnedFamily_MembersArray()
        return supertest(app)
          .get(`/api/family_members/family/${family_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedMembers)
      })
    })
  })
})