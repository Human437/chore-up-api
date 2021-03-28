const ChoresService = {
  getChoreById(knex,id){
    return knex.from('chores').select('*').where('id',id).first()
  },
  insertChore(knex,chore){
    return knex
      .insert(chore)
      .into('chores')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  updateChore(knex,id,newChoreFields){
    return knex('chores')
      .where({id})
      .update(newChoreFields)
  },
  deleteChore(knex,id){
    return knex('chores')
      .where({id})
      .delete()
  }
}

module.exports = ChoresService