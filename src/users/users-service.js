const UsersService = {
  getUserById(knex,id){
    return knex.from('users').select('*').where('id',id).first()
  },
  insertUser(knex,user){
    return knex
      .insert(user)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  updateUser(knex,id,newUserFields){
    return knex('users')
      .where({id})
      .update(newUserFields)
  },
  deleteUser(knex,id){
    return knex('users')
      .where({id})
      .delete()
  },
  getUserByEmail(knex,email){
    return knex.from('users').select('*').where('email',email).first()
  },
}

module.exports = UsersService