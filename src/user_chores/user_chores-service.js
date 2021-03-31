const User_ChoresService = {
  getAllChoresByUserId(knex,userId){
    return knex.from('chores').leftJoin('user_chores','chores.id','user_chores.chore_id').select('*').where('user_chores.user_id',userId)
  },
  insertUser_Chore(knex,User_Chore){
    return knex
    .insert(User_Chore)
    .into('user_chores')
    .returning('*')
    .then(rows => {
      return rows[0]
    })  
  },
  updateUser_Chore(knex,id,newUser_ChoreFields){
    return knex('user_chores')
      .where({id})
      .update(newUser_ChoreFields)
  },
  deleteUser_Chore(knex,id){
    return knex('user_chores')
      .where({id})
      .delete()
  },
  getUser_ChoresById(knex,id){
    return knex.from('user_chores').select('*').where('id',id).first()
  }
}

module.exports = User_ChoresService