# Chore Up

When it comes to young and small children, exposing them to responsibility is important, but not necessarily the easiest thing to do. Chore Up aims to gamify doing chores  to make doing chores seem more interesting and to teach them that they will be held accountable. By marking a chore as done, the child is communicating that they have  
the task at hand and helps to build trust between the child and the parent. Should the child have lied about completion it is up to the parent to decide what the appropriate  
couse of action is considering the child has now not only lied but also disregarded their responsibility.

This is the back-end of the app. You can check out the repo for the client [here](https://github.com/Human437/chore-up-client) or you can view it live [here](https://chore-up-client.vercel.app/).

#### Dummy Admin Account Info
- Email: john-doe@test.com
- Password: aB3!bnmv
- Dummy Family Code: sGvElaiz

#### Dummy User Account Info
- Email: jake-doe@test.com
- Password: aB3!bnmv

### New Admin Demo
![](./gifsForReadMe/newAdmin.gif)

### New Regular User Demo
![](./gifsForReadMe/newRegUser.gif)

### Returning Admin Demo
![](./gifsForReadMe/returningAdmin.gif)

### Returning Regular User Demo
![](./gifsForReadMe/returningRegUser.gif)

### Technology Used
- Node.js
- Express
- Supertest
- Mocha and Chai
- PostgresSQL
- Knex.js
- Heroku

### Front-end
This API should be used in conjunction with the client made for this project which can be found [here](https://github.com/Human437/chore-up-client).

### Endpoints

The API is RESTful and all requests must be made with a authorization token. You can set your own authorization token in your own `.env` file. Follow the format for the `.env` file below.
````
API_TOKEN=INSERT-YOUR-TOKEN-HERE
DATABASE_URL=INSERT-YOUR-DATABASE-URL-HERE
TEST_DATABASE_URL=INSERT-YOUR-TEST-DATABASE-URL-HERE
````

- #### Chores: https://chore-up.herokuapp.com/api/chores
- #### Users: https://chore-up.herokuapp.com/api/users  
- #### Families: https://chore-up.herokuapp.com/api/families  
- #### User_Chores: https://chore-up.herokuapp.com/api/user_chores  
- #### Family_Members: https://chore-up.herokuapp.com/api/family_members
