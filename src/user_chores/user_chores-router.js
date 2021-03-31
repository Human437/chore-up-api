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

const serializeUser_Chores = user_chores => ({
  id: user_chores.id,
  user_id: xss(user_chores.user_id),
  chore_id: xss(user_chores.chore_id)  
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

User_ChoresRouter
  .route('/')
  .post(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    console.log(req.body)
    const {user_id, chore_id} = req.body
    
    const newUser_Chore = {user_id, chore_id}
    for (const [key,value] of Object.entries(newUser_Chore))
    if(typeof value === 'undefined')
    return res.status(400).json({
      error:{message: `Missing '${key}' in request body`}
    })
    User_ChoresService.insertUser_Chore(knexInstance,newUser_Chore)
      .then(user_chore => {
        res
          .status(201)
          .json(serializeUser_Chores(user_chore))
      })
      .catch(next)
  })

User_ChoresRouter
  .route('/:user_choreId')
  .all((req,res,next) => {
    const knexInstance = req.app.get('db')
    User_ChoresService.getUser_ChoresById(knexInstance,req.params.user_choreId)
      .then(user_chore => {
        if(!user_chore){
          return res.status(404).json({
            error: {message: `User_chore doesn't exist`}
          })
        }
        res.user_chore = user_chore
        next()
      })
      .catch(next)
  })
  .patch(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    const {user_id,chore_id} = req.body
    const user_choreInfoToUpdate = {user_id,chore_id}
    const id = req.params.user_choreId

    if (typeof user_id === 'undefined' && typeof chore_id === 'undefined'){
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'user_id' or 'chore_id'`
        }
      })
    }

    User_ChoresService.updateUser_Chore(knexInstance,id,user_choreInfoToUpdate)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req,res,next) => {
    const knexInstance = req.app.get('db')
    const id = req.params.user_choreId
    User_ChoresService.deleteChore(knexInstance,id)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = User_ChoresRouter