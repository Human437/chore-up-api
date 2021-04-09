const expresss = require('express')
const xss = require('xss')
const ChoresService = require('./chores-service')

const ChoresRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeChore = chore => ({
  id: chore.id,
  name: xss(chore.name),
  value: Number(xss(chore.value)),
  done: xss(chore.done) === 'true',
  comments: xss(chore.comments)
})

ChoresRouter
  .route('/')
  .post(jsonParser,(req,res,next)=>{
    const knexInstance = req.app.get('db')
    const {name,value,done,comments} = req.body
    const newChore = {name,value,done,comments}
    for (const [key,value] of Object.entries(newChore))
    if(typeof value === 'undefined')
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
    const {value,done,comments} = req.body
    const choreInfoToUpdate = {value,done,comments}
    const id = req.params.choreId

    if (typeof value === 'undefined' && typeof done === 'undefined' && typeof comments === 'undefined'){
      return res.status(400).json({
        error: {
          message: `Request body must contain at least one of 'value', 'done', or 'comments'`
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