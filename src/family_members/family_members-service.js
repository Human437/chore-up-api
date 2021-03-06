const Family_MembersService = {
  getAllMembersByFamilyId(knex,familyId){
    return knex
      .from('users')
      .leftJoin('family_members','users.id','family_members.user_id')
      .select('*')
      .where('family_members.family_id',familyId)
  },
  insertFamily_Member(knex,Family_Member){
    return knex
    .insert(Family_Member)
    .into('family_members')
    .returning('*')
    .then(rows => {
      return rows[0]
    })  
  },
  updateFamily_Member(knex,id,newFamily_MemberFields){
    return knex('family_members')
      .where({id})
      .update(newFamily_MemberFields)
  },
  deleteFamily_Member(knex,id){
    return knex('family_members')
      .where({id})
      .delete()
  },
  getFamily_MembersByFamily_MemberId(knex,id){
    return knex.from('family_members').select('*').where('id',id).first()
  },
  getFamily_MemberByUserId(knex,userId){
    return knex.from('family_members').select('*').where('user_id',userId).first()
  }
}

module.exports = Family_MembersService