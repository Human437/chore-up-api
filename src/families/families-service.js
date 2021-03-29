const FamiliesService = {
  getChoreById(knex,id){
    return knex.from('families').select('*').where('id',id).first()
  },
  insertChore(knex,chore){
    return knex
      .insert(chore)
      .into('families')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  updateChore(knex,id,newChoreFields){
    return knex('families')
      .where({id})
      .update(newChoreFields)
  },
  deleteChore(knex,id){
    return knex('families')
      .where({id})
      .delete()
  }
}

module.exports = FamiliesService