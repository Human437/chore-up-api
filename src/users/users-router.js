const expresss = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const UsersRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeUser = user => ({
  id: user.id,
  name: xss(user.name),
  level: xss(user.level),
  xp_till_level_up: xss(user.xp_till_level_up),
  email: xss(user.email),
  hashed_password: xss(user.hashed_password)
})

UsersRouter
  .route('/')
  .post(jsonParser,(req,res,next)=>{
    const knexInstance = req.app.get('db')
    const {name,level,xp_till_level_up,email,hashed_password} = req.body
    const newUser = {name,level,xp_till_level_up,email,hashed_password}
    for (const [key,value] of Object.entries(newUser))
    if(value === null)
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

module.exports = UsersRouter