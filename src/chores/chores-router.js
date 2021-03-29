const expresss = require('express')
const xss = require('xss')
const ChoresService = require('./chores-service')

const ChoresRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeChore = chore => ({
  id: chore.id,
  name: xss(chore.name),
  value: xss(chore.value),
  status: xss(chore.status),
  comments: xss(chore.comments)
})

ChoresRouter
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

ChoresRouter
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
  .patch(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    const {value,status,comments} = req.body
    const choreInfoToUpdate = {value,status,comments}
    const id = req.params.choreId

    if (typeof value === 'undefined' && typeof status === 'undefined' && typeof comments === 'undefined'){
      return res.status(400).json({
        error: {
          message: `Request body must contain at least one of 'value', 'status', or 'comments'`
        }
      })
    }
    ChoresService.updateChore(knexInstance,id,choreInfoToUpdate)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req,res,next) => {
    const knexInstance = req.app.get('db')
    const id = req.params.choreId
    ChoresService.deleteChore(knexInstance,id)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = ChoresRouter