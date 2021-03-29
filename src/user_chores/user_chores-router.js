const expresss = require('express')
const xss = require('xss')
const User_ChoresService = require('./user_chores-service')

const User_ChoresRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeJoinedUserChores = user_chores => ({
  id: user_chores.id,
  user_id: xss(user_chores.user_id),
  chore_id: xss(user_chores.chore_id),
  name: xss(user_chores.name),
  value: xss(user_chores.value),
  status: xss(user_chores.status),
  comments: xss(user_chores.comments)
})

User_ChoresRouter
  .route('/user/:userId')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db')
    User_ChoresService.getAllChoresByUserId(knexInstance,req.params.userId)
      .then(user_chores => {
        res.json(user_chores.map(serializeJoinedUserChores))
        next()
      })
      .catch(next)
  })

module.exports = User_ChoresRouter