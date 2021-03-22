const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const Item = require('../models/item')

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

    test('DELETE: response.result.ok should return 1', async () => {
      const response = await Item.deleteOne(id)
      console.log(response.result, 'ini dari delete')
      expect(response.result.ok).toBeTruthy()
    })
  
    // test('UPDATE_ONE_CHECKER: should return updated data of item', async () => {
    //   const UPDATE_ONE = `
    //     mutation checkerUpdateItem($id: ID!, $quantity: Int, $access_token: String){
    //       checkerUpdateItem(id:$id, quantity: $quantity, access_token: $access_token){
    //         _id
    //         name
    //         quantity
    //       }
    //     }
    //   `
    //   const input = {
    //     id: `${id}`,
    //     quantity: 10,
    //     access_token: `${access_token_checker}`
    //   }
    
    //   // act
    //   const response = await mutate({ mutation: UPDATE_ONE, variables: input })
    //   console.log(response, 'update one checker')
    //   // console.log(response.data, 'data data data dari update ONE')
    //   // assert
    //   expect(response.data.checkerUpdateItem).toHaveProperty('_id', input.id, expect.any(String));
    //   expect(response.data.checkerUpdateItem).toHaveProperty('name', expect.any(String));
    //   expect(response.data.checkerUpdateItem).toHaveProperty('quantity', expect.any(Number));
    // });
  
    // test('UPDATE_ONE_PICKER: should return updated data of item', async () => {
    //   const UPDATE_ONE = `
    //     mutation pickerUpdateItem($id: ID!, $quantity: Int, $access_token: String){
    //       pickerUpdateItem(id:$id, quantity: $quantity, access_token: $access_token){
    //         _id
    //         name
    //         quantity
    //       }
    //     }
    //   `
    //   const input = {
    //     id: `${id}`,
    //     quantity: 2,
    //     access_token: `${access_token_picker}`
    //   }
    
    //   // act
    //   const response = await mutate({ mutation: UPDATE_ONE, variables: input })
    //   console.log(response.data, 'data data data dari update ONE picker')
    //   // assert
    //   expect(response.data.pickerUpdateItem).toHaveProperty('_id', input.id, expect.any(String));
    //   expect(response.data.pickerUpdateItem).toHaveProperty('name', expect.any(String));
    //   expect(response.data.pickerUpdateItem).toHaveProperty('quantity', expect.any(Number));
    // });
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
      console.log(response, 'dari findone ITEM')
      // assert
      expect(response.data.item).toEqual(null)  
    })
    //ERROR - PROVIDED WRONG ACCESS_TOKEN
    // test('UPDATE_ONE_CHECKER: should return updated data of item', async () => {
    //   const UPDATE_ONE = `
    //     mutation  checkerUpdateItem($id: ID!, $quantity: Int, $access_token: String){
    //       checkerUpdateItem(id:$id, quantity: $quantity, access_token: $access_token){
    //         _id
    //         name
    //         quantity
    //       }
    //     }
    //   `
    //   const input = {
    //     id: `${id}`,
    //     quantity: 10,
    //     access_token: `${access_token_picker}`
    //   }
    
    //   // act
    //   const response = await query({ query: UPDATE_ONE, variables: input })
    //   // console.log(response)
    //   // assert
    //   expect(response.errors).toBeDefined()
    // });
  
    //ERROR - PROVIDED WRONG ACCESS_TOKEN
    
    // test('UPDATE_ONE_PICKER: should return updated data of item', async () => {
    //   const UPDATE_ONE = `
    //     mutation pickerUpdateItem($id: ID!, $quantity: Int, $access_token: String){
    //       pickerUpdateItem(id:$id, quantity: $quantity, access_token: $access_token){
    //         _id
    //         name
    //         quantity
    //       }
    //     }
    //   `
    //   const input = {
    //     id: `${id}`,
    //     quantity: 2,
    //     access_token: `${access_token_checker}`
    //   }
    
    //   // act
    //   const response = await mutate({ mutation: UPDATE_ONE, variables: input })
    //   // console.log(response, 'data data data dari update ONE ERROR')
    //   // asserty('quantity', expect.any(Number));
    //   expect(response.errors).toBeDefined()
    // });
  })
})

