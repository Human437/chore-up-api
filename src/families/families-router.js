const expresss = require('express')
const xss = require('xss')
const FamiliesService = require('./families-service')

const FamiliesRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeFamily = family => ({
  id: family.id,
  admin: xss(family.admin),
  code_to_join: xss(family.code_to_join)
})

FamiliesRouter
  .route('/')
  .post(jsonParser,(req,res,next)=>{
    const knexInstance = req.app.get('db')
    const {admin,code_to_join} = req.body
    const newFamily = {admin,code_to_join}
    for (const [key,value] of Object.entries(newFamily))
    if(value === null)
    return res.status(400).json({
      error:{message: `Missing '${key}' in request body`}
    })
    FamiliesService.insertFamily(knexInstance,newFamily)
      .then(family => {
        res
          .status(201)
          .json(serializeFamily(family))
      })
      .catch(next)
  })

FamiliesRouter
  .route('/:familyId')
  .all((req,res,next) => {
    const knexInstance = req.app.get('db')
    FamiliesService.getFamilyById(knexInstance,req.params.familyId)
      .then(family => {
        if(!family){
          return res.status(404).json({
            error: {message: `Family doesn't exist`}
          })
        }
        res.family = family
        next()
      })
      .catch(next)
  })
  .get((req,res,next) => {
    res.json(serializeFamily(res.family))
  })
  .delete((req,res,next) => {
    const knexInstance = req.app.get('db')
    const id = req.params.familyId
    FamiliesService.deleteFamily(knexInstance,id)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    const {admin,code_to_join} = req.body
    const familyInfoToUpdate = {admin,code_to_join}
    const id = req.params.familyId
    console.log(typeof admin)
    if (typeof admin === 'undefined' && typeof code_to_join === 'undefined'){
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'admin' or 'code_to_join'`
        }
      })
    }
    FamiliesService.updateFamily(knexInstance,id,familyInfoToUpdate)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = FamiliesRouter