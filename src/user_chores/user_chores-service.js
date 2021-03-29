const User_ChoresService = {
  getAllChoresByUserId(knex,userId){
    return knex.from('chores').leftJoin('user_chores','chores.id','user_chores.chore_id').select('*').where('user_chores.user_id',userId)
  }
}

module.exports = User_ChoresService