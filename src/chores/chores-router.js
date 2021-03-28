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

module.exports = choresRouter