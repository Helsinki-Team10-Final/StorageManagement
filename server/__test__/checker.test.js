const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);


describe('Checker test', () => {
  let idPo1;
  let idPo2;
  let idBroadCast
  let access_token_buyer
  let access_token_checker
  let access_token_warehouseadmin
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

    const warehouseadmin = {
        "email": "warehouseadmin@mail.com",
        "password": "123456",
        "role": "warehouseadmin",
        "name": "user3"
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

    const warehouseadmin_login = {
      "email": "warehouseadmin@mail.com",
      "password": "123456"
    }
    
    const CREATE_BROADCAST_CHECKER = `
    mutation createBroadcastChecker($idPurchasingOrder: ID!, $access_token: String) {
      createBroadcastChecker(idPurchasingOrder: $idPurchasingOrder, access_token: $access_token) {
        _id
        purchasingOrder {
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
          role
          checkerId
        }
      }
    `

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
            "name": "pensil",
            "quantity": 20
          },
          {
            "name": "penghapus",
            "quantity": 10
          }
        ]
    }
  
    // act
    // act
    //Register
    await mutate({ mutation: USER_REGISTER, variables: {input: buyer} });
    await mutate({ mutation: USER_REGISTER, variables: {input: checker} });
    await mutate({ mutation: USER_REGISTER, variables: {input: warehouseadmin} });
    //Login
    const responseBuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    const responseChecker = await mutate({ mutation: USER_LOGIN, variables: {input: checker_login} });
    const responseWarehouseadmin = await mutate({ mutation: USER_LOGIN, variables: {input: warehouseadmin_login} });
    access_token_buyer = responseBuyer.data.login.access_token
    access_token_checker = responseChecker.data.login.access_token
    access_token_warehouseadmin = responseWarehouseadmin.data.login.access_token
    //Create Broadcast
    // console.log(access_token_buyer)
    const responsePO1 = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
    const responsePO2 = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input2, access_token: access_token_buyer} });
    idPo1 = responsePO1.data.createPurchasingOrder._id
    idPo2 = responsePO2.data.createPurchasingOrder._id
    createdAt = responsePO1.data.createPurchasingOrder.createdAt

    const inputBroadcast1 = {
      idPurchasingOrder: idPo1,
      access_token: access_token_warehouseadmin
    }

    const inputBroadcast2 = {
      idPurchasingOrder: idPo2,
      access_token: access_token_warehouseadmin
    }

    const responseBroadcast1 = await mutate({ mutation: CREATE_BROADCAST_CHECKER, variables: inputBroadcast1 });
    await mutate({ mutation: CREATE_BROADCAST_CHECKER, variables: inputBroadcast2 });
    idBroadCast = responseBroadcast1.data.createBroadcastChecker._id
    // console.log(idBroadCast, 'ini id broad')
    // console.log(responseChecker.data.login.access_token, 'iini dari beforeall token token punya CHECKER')
    // console.log(responsePicker.data.login.access_token, 'iini dari beforeall token token punya PICKER')
    // console.log('ini before All')
  
    // act
  })

  afterAll(async () => {
    // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('purchasingorder').deleteMany({})
    await getDatabase().collection('broadcasts').deleteMany({})
  })

  describe('Checker success case', () => {
    test('FIND_ALL: should return list of all broadcast for checker data', async () => {
      const FIND_BROADCAST_CHECKER = `
        query broadcastChecker($access_token: String) {
          broadcastChecker(access_token: $access_token) {
            broadcasts {
              _id
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
              }
              role
              checkerId
            },
            unfinishedBroadcast {
              _id
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
              }
              role
              checkerId
            }
          }
        }
      `

      const response = await query({ query: FIND_BROADCAST_CHECKER, variables: { access_token: access_token_checker }})

      expect(response.data.broadcastChecker).toHaveProperty('broadcasts')
    })

    test('FIND_BY_ID: should return broadcast data with specific properties', async () => {
      const FIND_BROADCAST_BY_ID = `
        query broadcastCheckerById($access_token: String!, $id: ID!) {
          broadcastCheckerById(access_token: $access_token, id: $id) {
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
      `

      const response = await query({ query: FIND_BROADCAST_BY_ID, variables: { access_token: access_token_checker, id: idBroadCast }})
      // console.log(response, 'ini dari fin id')
      expect(response.data.broadcastCheckerById).toHaveProperty('_id', expect.any(String))
      expect(response.data.broadcastCheckerById).toHaveProperty('purchasingOrder')
      expect(response.data.broadcastCheckerById).toHaveProperty('role', expect.any(String))
      expect(response.data.broadcastCheckerById).toHaveProperty('checkerId', expect.any(String))        
    })

    test('CHECKER_UPDATE_ITEM: should return success message', async () => {
      const CHECKER_UPDATE_ITEM = `
        mutation checkerUpdateItem($items: [ItemInputUpdate], $access_token: String, $idPO: String, $idBroadCast: String) {
          checkerUpdateItem(items: $items, access_token: $access_token, idPO: $idPO, idBroadCast: $idBroadCast)
        }
      `

      const items = [
          {
            name: "yamin",
            quantity: 20,
            currentQuantity: 20
          },
          {
            name: "lemper",
            quantity: 10,
            currentQuantity: 10
          }
        ]

      const response = await mutate({ mutation: CHECKER_UPDATE_ITEM, variables: { items, access_token: access_token_checker, idPO: idPo1, idBroadCast}})
      // console.log(response.data, 'ini dari update')
      expect(typeof response.data.checkerUpdateItem).toEqual('string')
    })
  })

  describe('Checker fail case', () => {
    test(`FIND_ALL: should return error when provided wrong access_token`, async () => {
      const FIND_BROADCAST_CHECKER = `
        query broadcastChecker($access_token: String) {
          broadcastChecker(access_token: $access_token) {
            broadcasts {
              _id
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
              }
              role
              checkerId
            },
            unfinishedBroadcast {
              _id
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
              }
              role
              checkerId
            }
          }
        }
      `

      const response = await query({ query: FIND_BROADCAST_CHECKER, variables: { access_token: access_token_buyer }})
      console.log(response)
      expect(response.errors).toBeDefined()
    })

    test('FIND_BY_ID: should return error when provided wrong access_token', async () => {
      const FIND_BROADCAST_BY_ID = `
        query broadcastCheckerById($access_token: String!, $id: ID!) {
          broadcastCheckerById(access_token: $access_token, id: $id) {
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
      `

      const response = await query({ query: FIND_BROADCAST_BY_ID, variables: { access_token: access_token_buyer, id: idBroadCast }})
      // console.log(response, 'ini')
      expect(response.errors).toBeDefined()
    })

    test('CHECKER_UPDATE_ITEM: should return error when provided wrong access_token', async () => {
      const CHECKER_UPDATE_ITEM = `
        mutation checkerUpdateItem($items: [ItemInputUpdate], $access_token: String, $idPO: String, $idBroadCast: String) {
          checkerUpdateItem(items: $items, access_token: $access_token, idPO: $idPO, idBroadCast: $idBroadCast)
        }
      `

      const items = [
          {
            name: "yamin",
            quantity: 20,
            currentQuantity: 20
          },
          {
            name: "lemper",
            quantity: 10,
            currentQuantity: 10
          }
        ]

      const response = await mutate({ mutation: CHECKER_UPDATE_ITEM, variables: { items, access_token: access_token_buyer, idPO: idPo1, idBroadCast}})
      console.log(response, 'ini dari update')
      expect(response.errors).toBeDefined()
    })
  })
})


