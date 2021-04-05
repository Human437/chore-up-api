function makeChoresArray(){
  return [
    {
      "id":1,
      "name":"Walk the dog",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":2,
      "name":"Take Jack to school",
      "value":20,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":3,
      "name":"Go to the PO box",
      "value":20,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":4,
      "name":"Buy groceries",
      "value":20,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":5,
      "name":"Water the plants",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":6,
      "name":"Do the laundry",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":7,
      "name":"Take out the trash",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":8,
      "name":"Do the laundry",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":9,
      "name":"Take out the trash",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":10,
      "name":"Do the laundry",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":11,
      "name":"Take out the trash",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":12,
      "name":"Feed the fish",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":13,
      "name":"Vacuum the carpet",
      "value":30,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":14,
      "name":"Water the plants",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":15,
      "name":"Clean the fridge",
      "value":30,
      "status":"Incomplete",
      "comments":""
    },
  ]
}

function makeUsersArray(){
  return [
    {
      "id":1,
      "name":"Bob",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":true,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
    {
      "id":2,
      "name":"Jack",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":false,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
    {
      "id":3,
      "name":"Jill",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":false,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
    {
      "id":4,
      "name":"Mary",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":true,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
    {
      "id":5,
      "name":"John",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":false,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
    {
      "id":6,
      "name":"Amy",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":false,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
  ]
}

function makeFamiliesArray(){
  return [
    {
      "id" : 1,
      "admin":1,
      "code_to_join":"aJk3T"
    },
    {
      "id" : 2,
      "admin":4,
      "code_to_join":"bJk3T"
    },
  ]
}

function makeFamily_MembersArray(){
  return [
    {
      "id":1,
      "user_id": 1,
      "family_id":1
    },
    {
      "id":2,
      "user_id": 2,
      "family_id":1
    },
    {
      "id":3,
      "user_id": 3,
      "family_id":1
    },
    {
      "id":4,
      "user_id": 4,
      "family_id":2
    },
    {
      "id":5,
      "user_id": 5,
      "family_id":2
    },
    {
      "id":6,
      "user_id": 6,
      "family_id":2
    },
  ]
}

function makeUser_ChoresArray(){
  return [
    {
      "id":1,
      "user_id":1,
      "chore_id":1
    },
    {
      "id":2,
      "user_id":1,
      "chore_id":2
    },
    {
      "id":3,
      "user_id":1,
      "chore_id":3
    },
    {
      "id":4,
      "user_id":2,
      "chore_id":4
    },
    {
      "id":5,
      "user_id":3,
      "chore_id":5
    },
  ]
}

function makeReturnedUser_ChoresArray(){
  return [
    {
      "id":1,
      "user_id":1,
      "chore_id":1,
      "name":"Walk the dog",
      "value":10,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":2,
      "user_id":1,
      "chore_id":2,
      "name":"Take Jack to school",
      "value":20,
      "status":"Incomplete",
      "comments":""
    },
    {
      "id":3,
      "user_id":1,
      "chore_id":3,
      "name":"Go to the PO box",
      "value":20,
      "status":"Incomplete",
      "comments":""
    },
  ]
}

function makeReturnedFamily_MembersArray(){
  return [
    {
      "id":1,
      "user_id": 1,
      "family_id":1,
      "name":"Bob",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":true,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
    {
      "id":2,
      "user_id": 2,
      "family_id":1,
      "name":"Jack",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":false,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
    {
      "id":3,
      "user_id": 3,
      "family_id":1,
      "name":"Jill",
      "level":1,
      "xp_till_level_up":100,
      "is_admin":false,
      "email":"hwpyxoutfugfqbusvz@twzhhq.com",
      "hashed_password":"$2a$10$l1mqfAFPUolxGgJKL5tXHu4PUSoBNoD0JlM45RsBcaIcWkPa2UD0C",
    },
  ]
}

module.exports = {
  makeChoresArray,
  makeUsersArray,
  makeFamiliesArray,
  makeFamily_MembersArray,
  makeUser_ChoresArray,
  makeReturnedUser_ChoresArray,
  makeReturnedFamily_MembersArray,
}