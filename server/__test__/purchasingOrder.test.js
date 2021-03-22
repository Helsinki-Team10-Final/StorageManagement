const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const Item = require('../models/item')

describe('Item Success Cases', () => {
  let id;
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
    // console.log('ini before All')
  })

  afterAll(async () => {
    // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('purchasingorder').deleteMany({})
  })
  
  test('CREATE: should return item data with specific property', async () => {
    // create a new instance of our server (not listening on any port)
    // await connect()
    
    // apollo-server-testing provides a query function
    // in order to execute graphql queries on that server
    
    // graphl query
    const CREATE_PURCHASING_ORDER = `
      mutation createPurchasingOrder($input: CreatePurchasingOrderInput, $access_token: String!) {
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
    id = response.data.createPurchasingOrder._id
    createdAt = response.data.createPurchasingOrder.createdAt
    // console.log(response, 'ini dari create PO')
    // console.log(response.data.createItem.quantity, 'ini dari item')
    // // assert
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
    // assert
      //masih bingung. disini
    // expect(typeof response.data.items).toEqual('array');
    expect(typeof response.data.purchasingOrders).toEqual('object')
  });
  
  test('FIND_ONE: should return purchasing order data with specific detail', async () => {
    const FIND_ONE = `
      query purchasingOrderById{
        purchasingOrderById (id: "${id}"){
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
    `
    
    // act
    const response = await query({ query: FIND_ONE, variables: {} })
    // console.log(response.data.purchasingOrderById.items, 'dari findone ITEM')
    // assert
    expect(response.data.purchasingOrderById).toHaveProperty('_id', expect.any(String));
    expect(response.data.purchasingOrderById).toHaveProperty('vendorName', expect.any(String));
    expect(response.data.purchasingOrderById).toHaveProperty('status', expect.any(String));
    expect(response.data.purchasingOrderById).toHaveProperty('items');
    expect(response.data.purchasingOrderById).toHaveProperty('createdAt', expect.any(String));
    expect(response.data.purchasingOrderById).toHaveProperty('createdAt', expect.any(String));
    expect(response.data.purchasingOrderById).toHaveProperty('expiredDate', expect.any(String));
  });

  test('UPDATE_ONE_CHECKER: update current quantity purchasing orders should return updated data', async () => {
    const UPDATE_ONE = `
      mutation updateCurrentQuantityPurchasingOrder($id: ID!, $input: UpdateCurrentQuantityPurchasingOrderInput, $access_token: String) {
        updateCurrentQuantityPurchasingOrder(id: $id, input: $input, access_token: $access_token){
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
    `

    const input = {
      _id: id,
      vendorName: 'warung mamang',
      items: [
          {
            "name": "yamin",
            "quantity": 20,
            "currentQuantity": 20
          },
          {
            "name": "lemper",
            "quantity": 10,
            "currentQuantity": 10
          }
        ],
      status: "process",
      createdAt,
      updatedAt: "2021-03-21T07:54:22.851Z",
      expiredDate: "2021-03-20T04:55:17.064Z"
    }
  
    // act
    const response = await mutate({ mutation: UPDATE_ONE, variables: {id, input, access_token: access_token_checker} })
    // console.log(response, 'update one checker')
    // console.log(response.data.updateCurrentQuantityPurchasingOrder.items, 'update one checker')
    // console.log(response.data, 'data data data dari update ONE')
    // assert
    expect(response.data.updateCurrentQuantityPurchasingOrder).toHaveProperty('_id', expect.any(String))
    expect(response.data.updateCurrentQuantityPurchasingOrder).toHaveProperty('vendorName', expect.any(String));
    expect(response.data.updateCurrentQuantityPurchasingOrder).toHaveProperty('status', expect.any(String));
    expect(response.data.updateCurrentQuantityPurchasingOrder).toHaveProperty('items');
    expect(response.data.updateCurrentQuantityPurchasingOrder).toHaveProperty('createdAt', expect.any(String));
    expect(response.data.updateCurrentQuantityPurchasingOrder).toHaveProperty('updatedAt', expect.any(String));
    expect(response.data.updateCurrentQuantityPurchasingOrder).toHaveProperty('expiredDate', expect.any(String));
    expect(response.data.updateCurrentQuantityPurchasingOrder._id).toEqual(input._id);
    expect(response.data.updateCurrentQuantityPurchasingOrder.vendorName).toEqual(input.vendorName);
    expect(response.data.updateCurrentQuantityPurchasingOrder.items).toEqual(input.items);
    expect(response.data.updateCurrentQuantityPurchasingOrder.createdAt).toEqual(input.createdAt);
    expect(response.data.updateCurrentQuantityPurchasingOrder.expiredDate).toEqual(input.expiredDate);
  });
})

describe('Item Fail Cases', () => {
  let id;
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

    const CREATE_PURCHASING_ORDER = `
      mutation createPurchasingOrder($input: CreatePurchasingOrderInput, $access_token: String!) {
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
    id = responsePO.data.createPurchasingOrder._id
    createdAt = responsePO.data.createPurchasingOrder.createdAt
    // console.log('ini before All')
  })

  afterAll(async () => {
    // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('purchasingorder').deleteMany({})
  })

  //ERROR - PROVIDED WRONG ACCESS_TOKEN
  test('CREATE: should return item data with specific property', async () => {
    // create a new instance of our server (not listening on any port)
    // await connect()
    
    // apollo-server-testing provides a query function
    // in order to execute graphql queries on that server
    
    // graphl query
    const CREATE_PURCHASING_ORDER = `
      mutation createPurchasingOrder($input: CreatePurchasingOrderInput, $access_token: String!) {
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
    expect(response.errors).toBeDefined()
  });

  test('UPDATE_ONE_CHECKER: update current quantity purchasing orders should return updated data', async () => {
    const UPDATE_ONE = `
      mutation updateCurrentQuantityPurchasingOrder($id: ID!, $input: UpdateCurrentQuantityPurchasingOrderInput, $access_token: String) {
        updateCurrentQuantityPurchasingOrder(id: $id, input: $input, access_token: $access_token){
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
    `

    const input = {
      _id: id,
      vendorName: 'warung mamang',
      items: [
          {
            "name": "yamin",
            "quantity": 20,
            "currentQuantity": 20
          },
          {
            "name": "lemper",
            "quantity": 10,
            "currentQuantity": 10
          }
        ],
      status: "process",
      createdAt,
      updatedAt: "2021-03-21T07:54:22.851Z",
      expiredDate: "2021-03-20T04:55:17.064Z"
    }
  
    // act
    const response = await mutate({ mutation: UPDATE_ONE, variables: {id, input, access_token: access_token_buyer} })
    // console.log(response, 'update one checker')
    // console.log(response.data.updateCurrentQuantityPurchasingOrder.items, 'update one checker')
    // console.log(response.data, 'data data data dari update ONE')
    // assert
    expect(response.errors).toBeDefined()
  });
})