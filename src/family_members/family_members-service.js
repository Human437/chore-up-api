const Family_MembersService = {
  getAllMembersByFamilyId(knex,familyId){
    return knex
      .from('users')
      .leftJoin('family_members','users.id','family_members.family_id')
      .select('*')
      .where('family_members.family_id',familyId)
  }
}

module.exports = Family_MembersService