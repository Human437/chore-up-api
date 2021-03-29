const FamiliesService = {
  getFamilyById(knex,id){
    return knex.from('families').select('*').where('id',id).first()
  },
  insertFamily(knex,family){
    return knex
      .insert(family)
      .into('families')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  updateFamily(knex,id,newFamilyFields){
    return knex('families')
      .where({id})
      .update(newFamilyFields)
  },
  deleteFamily(knex,id){
    return knex('families')
      .where({id})
      .delete()
  }
}

module.exports = FamiliesService