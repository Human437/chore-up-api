const expresss = require('express')
const xss = require('xss')
const Family_MembersService = require('./family_members-service')

const Family_MembersRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeFamily_Members = family_member => ({
  id: family_member.id,
  user_id: xss(family_member.user_id),
  family_id: xss(family_member.family_id),
})

Family_MembersRouter
  .route('/family/:familyId')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db')
    Family_MembersService.getAllMembersByFamilyId(knexInstance,req.params.familyId)
      .then(family_members => {
        res.json(family_members)
        next()
      })
      .catch(next)
  })

  Family_MembersRouter
  .route('/')
  .post(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    console.log(req.body)
    const {user_id, family_id} = req.body
    
    const newFamily_Member = {user_id, family_id}
    for (const [key,value] of Object.entries(newFamily_Member))
    if(typeof value === 'undefined')
    return res.status(400).json({
      error:{message: `Missing '${key}' in request body`}
    })
    Family_MembersService.insertFamily_Member(knexInstance,newFamily_Member)
      .then(family_member => {
        res
          .status(201)
          .json(serializeFamily_Members(family_member))
      })
      .catch(next)
  })

Family_MembersRouter
  .route('/:family_memberId')
  .all((req,res,next) => {
    const knexInstance = req.app.get('db')
    Family_MembersService.getFamily_MembersById(knexInstance,req.params.family_memberId)
      .then(family_member => {
        if(!family_member){
          return res.status(404).json({
            error: {message: `Family_Member doesn't exist`}
          })
        }
        res.family_member = family_member
        next()
      })
      .catch(next)
  })
  .get((req,res,next) => {
    res.json(serializeFamily_Members(res.family_member))
  })
  .patch(jsonParser,(req,res,next) => {
    const knexInstance = req.app.get('db')
    const {user_id,family_id} = req.body
    const family_memberInfoToUpdate = {user_id,family_id}
    const id = req.params.family_memberId

    if (typeof user_id === 'undefined' && typeof family_id === 'undefined'){
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'user_id' or 'family_id'`
        }
      })
    }

    Family_MembersService.updateFamily_Member(knexInstance,id,family_memberInfoToUpdate)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req,res,next) => {
    const knexInstance = req.app.get('db')
    const id = req.params.family_memberId
    Family_MembersService.deleteFamily_Member(knexInstance,id)
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = Family_MembersRouter