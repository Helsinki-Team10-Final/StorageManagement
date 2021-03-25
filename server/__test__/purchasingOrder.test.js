const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const Item = require('../models/item')


describe('Purchasing Order Test', () => {
  let idPO;
  let access_token_buyer
  let access_token_checker
  let createdAt
  
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
    
    const buyer = {
        "email": "buyer@mail.com",
        "password": "123456",
        "role": "buyer",
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
  
    const buyer_login = {
      "email": "buyer@mail.com",
      "password": "123456"
    }

    const checker_login = {
      "email": "checker@mail.com",
      "password": "123456"
    }


  
    // act
    
    // act
    //Register
    await mutate({ mutation: USER_REGISTER, variables: {input: buyer} });
    await mutate({ mutation: USER_REGISTER, variables: {input: checker} });
    //Login
    const responseBuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    const responseChecker = await mutate({ mutation: USER_LOGIN, variables: {input: checker_login} });
    // console.log(responseChecker.data.login.access_token, 'iini dari beforeall token token punya CHECKER')
    // console.log(responsePicker.data.login.access_token, 'iini dari beforeall token token punya PICKER')
    access_token_buyer = responseBuyer.data.login.access_token
    access_token_checker = responseChecker.data.login.access_token
  })

  afterAll(async () => {
    // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('purchasingorder').deleteMany({})
    await getDatabase().collection('pohistories').deleteMany({})
  })

  describe('Purchasing Order Success Cases', () => {
    test('CREATE: should return item data with specific property', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
      const CREATE_PURCHASING_ORDER = `
        mutation createPurchasingOrder($input: CreatePurchasingOrderInput!, $access_token: String!) {
          createPurchasingOrder(input: $input, access_token: $access_token) {
            _id
            vendorName
            status,
            items {
              name
              quantity
              currentQuantity
            },
            createdAt
            updatedAt
            expiredDate
          }
        }
      `;
      
      const input1 = {
          "vendorName": "warung mamang",
          "expiredDate": "2021-03-20T04:55:17.064Z",
          "items": [
            {
              "name": "yamin",
              "quantity": 20
            },
            {
              "name": "lemper",
              "quantity": 10
            }
          ]
      }

      const input2 = {
          "vendorName": "warung babeh",
          "expiredDate": "2021-03-20T04:55:17.064Z",
          "items": [
            {
              "name": "kodok",
              "quantity": 2,
            },
            {
              "name": "toke",
              "quantity": 12
            }
          ]
      }
    
      // act
      const response = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
      await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input2, access_token: access_token_buyer} });
      idPO = response.data.createPurchasingOrder._id
      // console.log(response.data, 'ini dari test createPO')
      // console.log()
      createdAt = response.data.createPurchasingOrder.createdAt
      // console.log(response, 'ini dari create PO')
      // assert
      expect(response.data.createPurchasingOrder).toHaveProperty('_id', expect.any(String));
      expect(response.data.createPurchasingOrder).toHaveProperty('vendorName', input1.vendorName);
      expect(response.data.createPurchasingOrder).toHaveProperty('status');
      expect(response.data.createPurchasingOrder).toHaveProperty('items');
      expect(response.data.createPurchasingOrder).toHaveProperty('createdAt');
      expect(response.data.createPurchasingOrder).toHaveProperty('updatedAt');
      expect(response.data.createPurchasingOrder).toHaveProperty('expiredDate', input1.expiredDate);
    });
    
    test('FIND_ALL: should return list of all purchasing order data', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
    
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
    
      // graphl query
      const FIND_PURCHASING_ORDER = `
        query purchasingOrders {
          purchasingOrders{
            _id,
            vendorName,
            status,
            items {
              name
              quantity
              currentQuantity
            },
            createdAt,
            updatedAt,
            expiredDate
          }
        }
      `;
    
      // act
      const response = await query({ query: FIND_PURCHASING_ORDER, variables: {} });
      // console.log(response, 'ini dari findall')
      // assert
        //masih bingung. disini
      // expect(typeof response.data.items).toEqual('array');
      expect(typeof response.data.purchasingOrders).toEqual('object')
    });
    
    test('FIND_ONE: should return purchasing order data with specific detail', async () => {
      const FIND_ONE = `
        query purchasingOrderById($id: ID!){
          purchasingOrderById(id: $id) {
            _id
            vendorName
            items {
              name
              quantity
              currentQuantity
            }
            status
            createdAt
            updatedAt
            expiredDate
          }
        }
      `
      // type PurchasingOrder {
      //   _id: ID!
      //   vendorName: String!
      //   items: [ItemPO]
      //   status: String
      //   createdAt: Date
      //   updatedAt: Date
      //   expiredDate: Date
      // }

      // type ItemPO {
      //   name: String
      //   quantity: Int
      //   currentQuantity: Int
      // }
      
      // act
      // console.log(idPO, 'ini id dari setelah create PO')
      const response = await query({ query: FIND_ONE, variables: {id: idPO} })
      // console.log(response.data.purchasingOrderById, 'dari findone ITEM')
      // assert
      expect(response.data.purchasingOrderById).toHaveProperty('_id', expect.any(String));
      expect(response.data.purchasingOrderById).toHaveProperty('vendorName', expect.any(String));
      expect(response.data.purchasingOrderById).toHaveProperty('status', expect.any(String));
      expect(response.data.purchasingOrderById).toHaveProperty('items');
      expect(response.data.purchasingOrderById).toHaveProperty('createdAt', expect.any(String));
      expect(response.data.purchasingOrderById).toHaveProperty('createdAt', expect.any(String));
      expect(response.data.purchasingOrderById).toHaveProperty('expiredDate', expect.any(String));
    });
  })

  describe('Purchasing Order Fail Cases', () => {

    //ERROR - PROVIDED WRONG ACCESS_TOKEN
    test('CREATE: should return item data with specific property', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
      const CREATE_PURCHASING_ORDER = `
        mutation createPurchasingOrder($input: CreatePurchasingOrderInput!, $access_token: String!) {
          createPurchasingOrder(input: $input, access_token: $access_token) {
            _id
            vendorName
            status
            createdAt
            updatedAt
            expiredDate
          }
        }
      `;
      
      const input = {
          "vendorName": "warung mamang",
          "expiredDate": "2021-03-20T04:55:17.064Z",
          "items": [
            {
              "name": "yamin",
              "quantity": 20
            },
            {
              "name": "lemper",
              "quantity": 10
            }
          ]
      }
    
      // act
      const response = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input, access_token: access_token_checker} });
      // id = response.data.createPurchasingOrder._id
      // console.log(response, 'error')
      expect(response.errors).toBeDefined()
    });
    
    test('FIND_ONE: should return purchasing order data with specific detail', async () => {
      const FIND_ONE = `
        query purchasingOrderById($id: ID!){
          purchasingOrderById(id: $id) {
            _id
            vendorName
            items {
              name
              quantity
              currentQuantity
            }
            status
            createdAt
            updatedAt
            expiredDate
          }
        }
      `

      idPO ='60580e99384f742bccf26391'
      
      // act
      // console.log(idPO, 'ini id dari setelah create PO')
      const response = await query({ query: FIND_ONE, variables: {id: idPO} })
      // console.log(response.data.purchasingOrderById, 'dari findone ITEM')
      // assert
      // console.log(response, 'ini gagal find')
      expect(response.data.purchasingOrderById).toEqual(null)
    });
  })
})




  
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
    
    const buyer = {
        "email": "buyer@mail.com",
        "password": "123456",
        "role": "buyer",
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
  
    const buyer_login = {
      "email": "buyer@mail.com",
      "password": "123456"
    }

    const checker_login = {
      "email": "checker@mail.com",
      "password": "123456"
    }

    const CREATE_PURCHASING_ORDER = `
      mutation createPurchasingOrder($input: CreatePurchasingOrderInput!, $access_token: String!) {
        createPurchasingOrder(input: $input, access_token: $access_token) {
          _id
          vendorName
          status
          createdAt
          updatedAt
          expiredDate
        }
      }
    `;
    
    const input1 = {
        "vendorName": "warung mamang",
        "expiredDate": "2021-03-20T04:55:17.064Z",
        "items": [
          {
            "name": "yamin",
            "quantity": 20
          },
          {
            "name": "lemper",
            "quantity": 10
          }
        ]
    }
  
    // act
    
    // act
    //Register
    await mutate({ mutation: USER_REGISTER, variables: {input: buyer} });
    await mutate({ mutation: USER_REGISTER, variables: {input: checker} });
    //Login
    const responseBuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    const responseChecker = await mutate({ mutation: USER_LOGIN, variables: {input: checker_login} });
    // console.log(responseChecker.data.login.access_token, 'iini dari beforeall token token punya CHECKER')
    // console.log(responsePicker.data.login.access_token, 'iini dari beforeall token token punya PICKER')
    access_token_buyer = responseBuyer.data.login.access_token
    access_token_checker = responseChecker.data.login.access_token
    
    const responsePO = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
    // console.log('ini before All')
  })

  afterAll(async () => {
    // // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('purchasingorder').deleteMany({})
  })