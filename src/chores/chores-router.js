const expresss = require('express')
const xss = require('xss')
const ChoresService = require('./chores-service')

const choresRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeChore = chore => ({
  id: chore.id,
  name: xss(chore.name),
  value: xss(chore.value),
  status: xss(chore.status),
  comments: xss(chore.comments)
})

choresRouter
  .route('/')
  .post(jsonParser,(req,res,next)=>{
    const knexInstance = req.app.get('db')
    const {name,value,status,comments} = req.body
    const newChore = {name,value,status,comments}
    for (const [key,value] of Object.entries(newChore))
    if(value === null)
    return res.status(400).json({
      error:{message: `Missing '${key}' in request body`}
    })
    ChoresService.insertChore(knexInstance,newChore)
      .then(chore => {
        res
          .status(201)
          .json(serializeChore(chore))
      })
      .catch(next)
  })

choresRouter
  .route('/:choreId')
  .all((req,res,next) => {
    const knexInstance = req.app.get('db')
    ChoresService.getChoreById(knexInstance,req.params.choreId)
      .then(chore => {
        if(!chore){
          return res.status(404).json({
            error: {message: `Chore doesn't exist`}
          })
        }
        res.chore = chore
        next()
      })
      .catch(next)
  })
  .get((req,res,next) => {
    res.json(serializeChore(res.chore))
  })

module.exports = choresRouter