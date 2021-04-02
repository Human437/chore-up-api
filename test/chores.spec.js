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
  describe('DELETE /api/chores/:choreId', () => {
    context(`Given that thers are chores in the db to delete`, () => {
      const testChores = fixtures.makeChoresArray()
      const choreId = 1

      beforeEach('insert chores', () => {
        return db
          .into('chores')
          .insert(testChores)
      })

      it('responds with 204 and deletes the specified chore', () => {
        return supertest(app)
          .delete(`/api/chores/${choreId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(res => 
            supertest(app)  
              .get(`/api/chores/${choreId}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(404,{error: {message: `Chore doesn't exist`}})
          )
      })
    })
  })
  describe('POST /api/chores', () => {
    context(`Given that all the fields are provided`, () => {
      const newChore = {
        name: "Test chore",
        value: 10,
        status: "Done",
        comments: "This is a test chore"
      }
      it('Adds a new chore and returns with 201 and the chore just added', () => {
        return supertest(app)
        .post('/api/chores/')
        .send(newChore)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newChore.name)
          expect(res.body.value).to.eql(newChore.value)
          expect(res.body.status).to.eql(newChore.status)
          expect(res.body.comments).to.eql(newChore.comments)
        })
        .then(res =>
          supertest(app)  
            .get(`/api/chores/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        )
      })
    })
  })
})