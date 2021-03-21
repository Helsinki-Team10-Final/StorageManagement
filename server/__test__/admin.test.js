const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);

describe('Admin Success Case', () => {
  let id;
  let access_token_warehouseadmin;
  let access_token_buyer;
  let statusBefore

  beforeAll(async () => {
    // console.log('ini before All')
    await connect()
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
    
    const warehouseadmin = {
        "email": "warehouseadmin@mail.com",
        "password": "123456",
        "role": "warehouseadmin",
        "name": "user1"
    }

    const buyer = {
        "email": "buyer@mail.com",
        "password": "123456",
        "role": "buyer",
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
  
    const warehouseadmin_login = {
      "email": "warehouseadmin@mail.com",
      "password": "123456"
    }

    const buyer_login = {
      "email": "buyer@mail.com",
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
    await mutate({ mutation: USER_REGISTER, variables: {input: warehouseadmin} });
    await mutate({ mutation: USER_REGISTER, variables: {input: buyer} });
    //Login
    const responsewarehouseadmin = await mutate({ mutation: USER_LOGIN, variables: {input: warehouseadmin_login} });
    const responsebuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    access_token_warehouseadmin = responsewarehouseadmin.data.login.access_token
    access_token_buyer = responsebuyer.data.login.access_token
    
    const responsePO = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
    id = responsePO.data.createPurchasingOrder._id
    createdAt = responsePO.data.createPurchasingOrder.createdAt
    statusBefore = responsePO.data.createPurchasingOrder.status
    // console.log(access_token_warehouseadmin, 'punya admin')
    // console.log(access_token_buyer, 'punya chekcer')
    // console.log('ini before All')
  })

  afterAll(async () => {
    // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('productorders').deleteMany({})
    await getDatabase().collection('broadcasts').deleteMany({})
  })
  
  test('UPDATE_STATUS_PO: should return data with specific properties', async () => {
    // create a new instance of our server (not listening on any port)
    // await connect()
    
    // apollo-server-testing provides a query function
    // in order to execute graphql queries on that server
    
    // graphl query
    const UPDATE_STATUS_PO = `
      mutation updateStatusPurchasingOrderAdmin($id: ID!, $status: String, $access_token: String!) {
        updateStatusPurchasingOrderAdmin(id: $id, status: $status, access_token: $access_token) {
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
    
    const input = {
      id,
      status: 'clear',
      access_token: access_token_warehouseadmin
    }
  
    // act
    // console.log(statusBefore, 'ini before')
    const response = await mutate({ mutation: UPDATE_STATUS_PO, variables: input });
    // console.log(response.data.updateStatusPurchasingOrderAdmin.status, 'ini after')
    // id = response.data.createUser._id
    // console.log(response.data.createUser.name, 'ini dari register')
    // assert
    expect(response.data.updateStatusPurchasingOrderAdmin).toHaveProperty('_id', expect.any(String))
    expect(response.data.updateStatusPurchasingOrderAdmin).toHaveProperty('vendorName', expect.any(String));
    expect(response.data.updateStatusPurchasingOrderAdmin).toHaveProperty('status', expect.any(String));
    expect(response.data.updateStatusPurchasingOrderAdmin).toHaveProperty('items');
    expect(response.data.updateStatusPurchasingOrderAdmin).toHaveProperty('createdAt', expect.any(String));
    expect(response.data.updateStatusPurchasingOrderAdmin).toHaveProperty('updatedAt', expect.any(String));
    expect(response.data.updateStatusPurchasingOrderAdmin).toHaveProperty('expiredDate', expect.any(String));
    expect(response.data.updateStatusPurchasingOrderAdmin._id).toEqual(input.id);
    expect(response.data.updateStatusPurchasingOrderAdmin.status).toEqual(input.status);
  });
  
  test('CREATE_BROADCAST: should return data with specific properties', async () => {
    // create a new instance of our server (not listening on any port)
    // await connect()
  
    // apollo-server-testing provides a query function
    // in order to execute graphql queries on that server
  
    // graphl query
    const CREATE_BROADCAST = `
      mutation createBroadcast($idPurchasingOrder: ID!, $access_token: String!, $role: String!) {
        createBroadcast(idPurchasingOrder: $idPurchasingOrder, access_token: $access_token, role: $role) {
          _id,
          purchasingOrder {
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
          },
          role
          checkerId
        }
      }
    `;
  
    const input = {
      idPurchasingOrder: id,
      access_token: access_token_warehouseadmin,
      role: 'checker'
    }
  
    // act
    const response = await mutate({ mutation: CREATE_BROADCAST, variables: input });
    console.log(response, 'INI RESPONSE LOGIN BERHASIL')
    // console.log(respo, 'INI RESPONSE LOGIN BERHASIL')
    // assert
    expect(response.data.createBroadcast).toHaveProperty('_id');
    expect(response.data.createBroadcast).toHaveProperty('purchasingOrder');
    expect(response.data.createBroadcast).toHaveProperty('role', input.role, expect.any(String));
    expect(response.data.createBroadcast).toHaveProperty('checkerId');
  });

  describe('Admin Fail Case', () => {
  
    test('UPDATE_STATUS_PO: should return Error', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
    const UPDATE_STATUS_PO = `
      mutation updateStatusPurchasingOrderAdmin($id: ID!, $status: String, $access_token: String!) {
        updateStatusPurchasingOrderAdmin(id: $id, status: $status, access_token: $access_token) {
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
    
    const input = {
      id,
      status: 'clear',
      access_token: access_token_buyer
    }
  
    // act
    // console.log(statusBefore, 'ini before')
    const response = await mutate({ mutation: UPDATE_STATUS_PO, variables: input });
    
    expect(response.errors).toBeDefined();
    });
  })
})


