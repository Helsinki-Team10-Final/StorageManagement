const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const Item = require('../models/item')
const Store = require('../models/store')

describe('Item Test', () => {
  let id;
  let name;
  let access_token_checker;
  let access_token_picker;
  
  beforeAll(async () => {
    await connect()
    // Register
    const USER_REGISTER = `
      mutation createUser($input: CreateUserInput) {
        createUser(user: $input) {
          _id
          name
          role
          email
        }
      }
    `;
    
    const picker = {
        "email": "picker@mail.com",
        "password": "123456",
        "role": "picker",
        "name": "user1"
    }

    const checker = {
        "email": "checker@mail.com",
        "password": "123456",
        "role": "checker",
        "name": "user2"
    }

    //Login
    const USER_LOGIN = `
    mutation login($input: UserLoginInput) {
        login(input: $input){
          access_token
        }
      }
      `;
  
    const picker_login = {
      "email": "picker@mail.com",
      "password": "123456"
    }

    const checker_login = {
      "email": "checker@mail.com",
      "password": "123456"
    }

    const input1 = {
        name: 'Toko A'
      }

      const input2 = {
        name: 'Toko B'
      }
      

      const response = await Store.create(input1)
      await Store.create(input2)
    
    // act
      //Register
    await mutate({ mutation: USER_REGISTER, variables: {input: picker} });
    await mutate({ mutation: USER_REGISTER, variables: {input: checker} });
      //Login
    const responseChecker = await mutate({ mutation: USER_LOGIN, variables: {input: checker_login} });
    const responsePicker = await mutate({ mutation: USER_LOGIN, variables: {input: picker_login} });
    // console.log(responseChecker.data.login.access_token, 'iini dari beforeall token token punya CHECKER')
    // console.log(responsePicker.data.login.access_token, 'iini dari beforeall token token punya PICKER')
    access_token_checker = responseChecker.data.login.access_token
    access_token_picker = responsePicker.data.login.access_token
    // console.log('ini before All')
  })

  afterAll(async () => {
    // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('items').deleteMany({})
  })
  
  describe('Item Success Cases', () => {
    
    test('CREATE: should return item data with specific property', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
      const CREATE_ITEM = `
        mutation createItem($input: CreateItemInput) {
          createItem(item: $input) {
            _id
            name
            quantity
          }
        }
      `;
      
      const input = {
          "name": "semangka"
      }
    
      // act
      const response = await mutate({ mutation: CREATE_ITEM, variables: {input} });
      id = response.data.createItem._id
      name = response.data.createItem.name
      // console.log(response.data.createItem, 'ini dari item')
      // assert
      expect(response.data.createItem).toHaveProperty('_id');
      expect(response.data.createItem).toHaveProperty('name', input.name);
      expect(response.data.createItem).toHaveProperty('quantity', 0);
    });
    
    test('FIND_ALL: should return list of all item data', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
    
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
    
      // graphl query
      const FIND_ITEMS = `
        query findItems {
          items{
            _id
            name
            quantity
          }
        }
      `;
    
      // act
      const response = await query({ query: FIND_ITEMS, variables: {} });
      // assert
        //masih bingung disini
      // expect(typeof response.data.items).toEqual('array');
      expect(typeof response.data.items).toEqual('object')
    });
    
    test('FIND_ONE: should return item data with specific detail', async () => {
      const FIND_ONE = `
        query findOneItem{
          item (itemId: "${id}"){
            _id
            name
            quantity
          }
        }
      `
      
      // act
      const response = await query({ query: FIND_ONE, variables: {} })
      // console.log(response, 'dari findone ITEM')
      // assert
      expect(response.data.item).toHaveProperty('_id');
      expect(response.data.item).toHaveProperty('name');
      expect(response.data.item).toHaveProperty('quantity');
    });

    test('UPDATE_ONE: should return updated data with specific detail', async () => {
      const input  = 12

      const response = await Item.updateOne(id, input)
      console.log(response, 'update item')
      expect(response).toHaveProperty('_id')
      expect(response).toHaveProperty('name', expect.any(String))
      expect(response).toHaveProperty('quantity', expect.any(Number))
    })

    test('FIND_BY_NAME: should return item data with specific detail', async () => {
      
      const response = await Item.findOneByName(name)
      // console.log(response, 'find by name')
      expect(response).toHaveProperty('_id');
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('quantity');
    })

    test('FIND_ALL_STORE: should return list of store data', async () => {
      const FIND_ALL_STORE = `
        query stores {
          stores {
            _id
            name
          }
        }
      `

      const response = await query({ query: FIND_ALL_STORE, variables: {}})
      // console.log(response, 'find all toko')
      expect(typeof response.data.stores).toEqual('object')
    })
    test('DELETE: response.result.ok should return 1', async () => {
      const response = await Item.deleteOne(id)
      console.log(response.result, 'ini dari delete')
      expect(response.result.ok).toBeTruthy()
    })
  })

  describe('Item Fail Cases', () => {  
    test('FIND_ONE', async () => {
      const FIND_ONE = `
        query findOneItem{
          item (itemId: "60583c59ce327d3dee4803ff"){
            _id
            name
            quantity
          }
        }
      `
      
      // act
      const response = await query({ query: FIND_ONE, variables: {} })
      // console.log(response, 'dari findone ITEM')
      // assert
      expect(response.data.item).toEqual(null)  
    })

    test('CREATE: should return error', async () => {
      const CREATE_ITEM = `
        mutation createItem($input: CreateItemInput) {
          createItem(item: $input) {
            _id
            name
            quantity
          }
        }
      `;
      
      const input = {
          "name": "semangka"
      }
    
      // act
      const response = await mutate({ mutation: CREATE_ITEM, variables: input });
    })
  })
})

