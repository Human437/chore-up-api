require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token')
const ChoresRouter = require('./chores/chores-router')
const FamiliesRouter = require('./families/families-router')
const UsersRouter = require('./users/users-router')
const User_ChoresRouter = require('./user_chores/user_chores-router')
const Family_MembersRouter = require('./family_members/family_members-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'dev';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(validateBearerToken)
app.use('/api/chores',ChoresRouter)
app.use('/api/families',FamiliesRouter)
app.use('/api/users',UsersRouter)
app.use('/api/user_chores',User_ChoresRouter)
app.use('/api/family_members',Family_MembersRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app