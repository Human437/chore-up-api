const expresss = require('express')
const xss = require('xss')
const Family_MembersService = require('./family_members-service')

const Family_MembersRouter = expresss.Router()
const jsonParser = expresss.json()

const serializeFamilyMember = family_member => ({
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

module.exports = Family_MembersRouter