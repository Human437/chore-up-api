const expresss = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const UsersRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeUser = user => ({
  id: user.id,
  name: xss(user.name),
  level: Number(xss(user.level)),
  xp_till_level_up: Number(xss(user.xp_till_level_up)),
  is_admin:xss(user.is_admin)==='true',
  email: xss(user.email),
  hashed_password: xss(user.hashed_password)
})

UsersRouter
  .route('/')
  .get(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    const email = req.query.email
    if (typeof email === 'undefined'){
      return res.status(400).json({
        error: { message: `Missing email in request query` }
      })
    }
    UsersService.getUserByEmail(knexInstance,email)
      .then(user =>{
        if(typeof user === 'undefined'){
          return res.status(404).json({
            error: { message: `The email provided is not associated with any account` }
          })
        }
        res.json(serializeUser(user))
      })
      .catch(error => next(error))
  })
  .post(jsonParser,(req,res,next)=>{
    const knexInstance = req.app.get('db')
    const {name,level,xp_till_level_up,is_admin,email,hashed_password} = req.body
    const newUser = {name,level,xp_till_level_up,is_admin,email,hashed_password}
    for (const [key,value] of Object.entries(newUser))
    if(typeof value === 'undefined')
    return res.status(400).json({
      error:{message: `Missing '${key}' in request body`}
    })
    UsersService.insertUser(knexInstance,newUser)
      .then(user => {
        res
          .status(201)
          .json(serializeUser(user))
      })
      .catch(next)
  })

UsersRouter
  .route('/:userId')
  .all((req,res,next) => {
    const knexInstance = req.app.get('db')
    UsersService.getUserById(knexInstance,req.params.userId)
      .then(user => {
        if(!user){
          return res.status(404).json({
            error: {message: `User doesn't exist`}
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req,res,next) => {
    res.json(serializeUser(res.user))
  })
  .delete((req,res,next) => {
    const knexInstance = req.app.get('db')
    const id = req.params.userId
    UsersService.deleteUser(knexInstance,id)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    const {name,level,xp_till_level_up,email,hashed_password,is_admin} = req.body
    const userInfoToUpdate = {name,level,xp_till_level_up,email,hashed_password,is_admin}
    const id = req.params.userId

    let containsNone = true;
    for (const [key,value] of Object.entries(userInfoToUpdate)){
      if (typeof value !== 'undefined'){
        containsNone = false
      }
    }
    if(containsNone){
      return res.status(400).json({
        error: {
          message: `Request body must contain at least one of 'name', 'level', 'xp_till_level_up', 'is_admin', 'email', or 'hashed_password'`
        }
      })
    }
    UsersService.updateUser(knexInstance,id,userInfoToUpdate)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = UsersRouter