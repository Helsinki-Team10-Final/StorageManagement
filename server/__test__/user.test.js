const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const User = require('../models/user')

describe('User Test', () => {
  let id;
  let access_token;

  describe('User Success Case', () => {

    beforeAll(async () => {
      // console.log('ini before All')
      await connect()
    })

    afterAll(async () => {
      // console.log('ini after all')
      await getDatabase().collection('users').deleteMany({})
    })
    
    test('CREATE_USER: should return data with specific properties', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
      const USER_REGISTER = `
        mutation createUser($user: CreateUserInput) {
          createUser(user: $user) {
            _id
            name
            role
            email
          }
        }
      `;
      
      const user = {
          email: "picker@mail.com",
          password: "123456",
          role: "picker",
          name: "user1"
      }
      
    
      // act
      const response = await mutate({ mutation: USER_REGISTER, variables: {user} });
      // console.log(response)
      id = response.data.createUser._id
      // console.log(response.data.createUser.name, 'ini dari register')
      // assert
      expect(response.data.createUser).toHaveProperty('_id');
      expect(response.data.createUser).toHaveProperty('name');
      expect(response.data.createUser).toHaveProperty('role');
      expect(response.data.createUser).toHaveProperty('email');
    });
    
    test('LOGIN_USER: should return an access_token', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
    
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
    
      // graphl query
      const USER_LOGIN = `
        mutation login($input: UserLoginInput) {
          login(input: $input){
            access_token
          }
        }
      `;
    
      const input = {
        "email": "picker@mail.com",
        "password": "123456"
      }
    
      // act
      const response = await mutate({ mutation: USER_LOGIN, variables: {input} });
      // console.log(response, 'INI RESPONSE LOGIN BERHASIL')
      // assert
      expect(response.data.login).toHaveProperty('access_token');
    });
    
    test('UPDATE_USER: should return updated user data with specific detail', async () => {
    
      // graphl query
      const input = {
        "email": "picker@mail.com",
        "password": "123456",
        "role": "picker",
        "name": "user123"
      }
      
      // act
      const response = await User.updateOne(id, input)
      // console.log(response, 'ini dari update')
      // console.log(response, 'dari updateeeeeeeeeeeeeeeeee')
      // assert
      expect(response).toHaveProperty('_id');
      expect(response).toHaveProperty('name', input.name);
      expect(response).toHaveProperty('role', input.role);
      expect(response).toHaveProperty('email', input.email);
    });

    test('FIND_ALL_USER: should return list data of user', async () => {
    
      //graphql query
      const FIND_USER = `
        query findUsers {
          users{
            _id
            name
            role
            email
          }
        }
      `
    
      // act
      const response = await query({ query: FIND_USER })
      // console.log(response.data.users, 'user find all')
      // assert
      expect(response.data).toBeDefined()
      expect(typeof response.data.users).toEqual('object')
    });

    test('DELETE_USER: should return response deletedCount to Equal 1', async () => {
      const response = await User.deleteOne(id)
      // console.log(response)
      expect(response.deletedCount).toEqual(1)
    })
  })

  describe('User Fail Case', () => {

    
    test('LOGIN_USER: should return Error', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
      const USER_LOGIN = `
        mutation login($input: UserLoginInput) {
          login(input: $input){
            access_token
          }
        }
      `;
    
      const input = {
        "email": "picker@mail.com",
        "password": "12345"
      }
    
      // act
      const response = await mutate({ mutation: USER_LOGIN, variables: {input} });
      // console.log(JSON.parse(response.errors[0].message), 'ALOWWWW')
      // console.log(response)
      // assert
      expect(response.errors).toBeDefined();
    });

    test('CREATE_USER: should return data with specific properties', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
      const USER_REGISTER = `
        mutation createUser($user: CreateUserInput) {
          createUser(user: $user) {
            _id
            name
            role
            email
          }
        }
      `;
      
      const user = {
          email: "picker@.com",
          password: null,
          role: null,
          name: undefined
      }
      
    
      // act
      const response = await mutate({ mutation: USER_REGISTER, variables: user });
      // console.log(response, 'ini dari create error')
      expect(response.errors).toBeDefined()
    })

    test('UPDATE_USER: should return updated user data with specific detail', async () => {
    
      // graphl query
      const input = {
        "email": "picker@mail.com",
        "password": "123456",
        "role": "picker",
        "name": "user123"
      }

      id = '60580e99384f742bccf26391'
      
      // act
      const response = await User.updateOne(id, input)
      // console.log(response, 'ini dari update gagal')
      // console.log(response, 'dari updateeeeeeeeeeeeeeeeee')
      // assert
      expect(response).toEqual(null)
    });

    test('DELETE_USER: should return response deletedCount to equal 0', async () => {
      id = '60580e99384f742bccf26391'
      const response = await User.deleteOne(id)
      // console.log(response)
      expect(response.deletedCount).toEqual(0)
    })
  })
})





