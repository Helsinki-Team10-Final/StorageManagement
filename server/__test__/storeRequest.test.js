const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);

describe('Store Request Test', () => {
  let access_token_buyer;
  let access_token_checker;
  let access_token_warehouseadmin
  let access_token_picker
  let idPO1
  let IdPO2
  let idBroadcastCheck
  let itemData1;
  let itemData2;
  let requestId

  beforeAll(async () => {
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
    
    const buyer = {
        "email": "buyer@mail.com",
        "password": "123456",
        "role": "buyer",
        "name": "user1"
    }

    const picker = {
        "email": "picker@mail.com",
        "password": "123456",
        "role": "picker",
        "name": "user2"
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

    const picker_login = {
      "email": "picker@mail.com",
      "password": "123456"
    }

    const warehouseadmin_login = {
      "email": "warehouseadmin@mail.com",
      "password": "123456"
    }

    const checker_login = {
      "email": "checker@mail.com",
      "password": "123456"
    }
    
    const CREATE_ITEM = `
        mutation createItem($input: CreateItemInput) {
          createItem(item: $input) {
            _id
            name
            quantity
          }
        }
      `;
      
    const itemInput1 = {
      name: "yamin"
    }

    const itemInput2 = {
      name: "lemper"
    }

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
            "name": "yamin",
            "quantity": 2,
          },
          {
            "name": "lemper",
            "quantity": 12
          }
        ]
    }
    
      
    
    // const { name } = itemInput1
    // console.log(name)
    //Create Item
    const responseItem1 = await mutate({ mutation: CREATE_ITEM, variables: { input: itemInput1 } });
    const responseItem2 = await mutate({ mutation: CREATE_ITEM, variables: { input: itemInput2 } });
    // console.log(responseItem1, 'ini response item')
    itemData1 = responseItem1.data.createItem
    itemData2 = responseItem2.data.createItem
    // act
      //Register
    await mutate({ mutation: USER_REGISTER, variables: {input: buyer} });
    await mutate({ mutation: USER_REGISTER, variables: {input: picker} });
    await mutate({ mutation: USER_REGISTER, variables: {input: warehouseadmin} });
    await mutate({ mutation: USER_REGISTER, variables: {input: checker} });
      //Login
    const responseBuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    const responsePicker = await mutate({ mutation: USER_LOGIN, variables: {input: picker_login} });
    const responseAdmin = await mutate({ mutation: USER_LOGIN, variables: {input: warehouseadmin_login} });
    const responseChecker = await mutate({ mutation: USER_LOGIN, variables: {input: checker_login} });
    // console.log(responseChecker.data.login.access_token, 'iini dari beforeall token token punya CHECKER')
    // console.log(responsePicker.data.login.access_token, 'iini dari beforeall token token punya PICKER')
    access_token_buyer = responseBuyer.data.login.access_token
    access_token_picker = responsePicker.data.login.access_token
    access_token_warehouseadmin = responseAdmin.data.login.access_token
    access_token_checker = responseChecker.data.login.access_token

    const responsePO = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
    await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input2, access_token: access_token_buyer} });
    idPO1 = responsePO.data.createPurchasingOrder._id
    idPO2 = responsePO.data.createPurchasingOrder._id
    // console.log(responsePO, 'dari STORETEST')

    const CREATE_BROADCAST_CHECKER = `
      mutation createBroadcastChecker($idPurchasingOrder: ID!, $access_token: String!) {
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

      // const inputCheck1 = {
      //   idPurchasingOrder: idPO1,
      //   access_token: access_token_warehouseadmin
      // }

      // const inputCheck2 = {
      //   idPurchasingOrder: IdPO2,
      //   access_token: access_token_warehouseadmin
      // }

      const responseCheck1 = await mutate({ mutation: CREATE_BROADCAST_CHECKER, variables: {idPurchasingOrder: idPO1, access_token: access_token_warehouseadmin} })
      const responseCheck2 = await mutate({ mutation: CREATE_BROADCAST_CHECKER, variables: {idPurchasingOrder: idPO2, access_token: access_token_warehouseadmin} })
      // console.log(responseCheck1, 'ini bc 111111')
      idBroadCastCheck = responseCheck1.data.createBroadcastChecker._id

      const CHECKER_UPDATE_ITEM = `
        mutation checkerUpdateItem($items: [ItemInputUpdate]!, $access_token: String!, $idPO: String!, $idBroadCast: String!) {
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

      const responseUp1 = await mutate({ mutation: CHECKER_UPDATE_ITEM, variables: { items, access_token: access_token_checker, idPO: idPO1, idBroadCast: idBroadCastCheck}})
      const responseUp2 = await mutate({ mutation: CHECKER_UPDATE_ITEM, variables: { items, access_token: access_token_checker, idPO: idPO2, idBroadCast: idBroadCastCheck}})
      console.log(responseUp2, 'ceki ceki')
      


  })

  afterAll(async () => {
    await getDatabase().collection('storerequests').deleteMany({})
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('purchasingorders').deleteMany({})
    await getDatabase().collection('broadcasts').deleteMany({})
    await getDatabase().collection('items').deleteMany({})
  })

  describe('Store request success case', () => {
    test('CREATE_REQUEST: should return store request data with specific property', async () => {
      const CREATE_STORE_REQUEST = `
        mutation createRequest($request: RequestInput!, $access_token: String!){
          createRequest(request: $request, access_token: $access_token) {
            _id
            storeName
            items {
              itemId
              itemName
              quantityRequest
            },
            createdAt
            updatedAt
            status
          }
        }
      `
      const input = {
        storeName: 'Toko Di Depan',
        items: [
          {
            itemId: itemData1._id,
            itemName: itemData1.name,
            quantityRequest: 10
          },
          {
            itemId: itemData2._id,
            itemName: itemData2.name,
            quantityRequest: 8
          }
        ]
      }
  
      const response = await mutate({ mutation: CREATE_STORE_REQUEST, variables: { request: input, access_token: access_token_buyer }})
      // console.log(response.data, 'iini dari create req')
      requestId = response.data.createRequest._id
      expect(response.data.createRequest).toHaveProperty('_id', expect.any(String))
      expect(response.data.createRequest).toHaveProperty('storeName', expect.any(String))
      expect(response.data.createRequest).toHaveProperty('items')
      expect(response.data.createRequest).toHaveProperty('createdAt')
      expect(response.data.createRequest).toHaveProperty('updatedAt')
      expect(response.data.createRequest).toHaveProperty('status', expect.any(String))
    })
  
    test('FIND_ALL: should return list of store request', async () => {
      const FIND_ALL = `
        query requests {
          requests {
            _id
            storeName
            items {
              itemId
              itemName
              quantityRequest
            },
            createdAt
            updatedAt
            status
          }
        }
      `
  
      const response = await query({ query: FIND_ALL, variables: {}})
      // console.log(response.data.requests, 'ini dari find')
      expect(typeof response.data.requests).toEqual('object')
    })
    
    test('FIND_BY_ID: should return specific store request data', async () => {
      const FIND_BY_ID = `
        query requestById($id: ID!) {
          requestById(id: $id) {
            _id
            storeName
            items {
              itemId
              itemName
              quantityRequest
            },
            createdAt
            updatedAt
            status
          }
        }
      `
      
  
      const response = await query({ query: FIND_BY_ID, variables: {id: requestId}})
      // console.log(response.data, 'ini dari findbyid')
      // expect(typeof response.data.request).toEqual('object')
      expect(response.data.requestById).toHaveProperty('_id', expect.any(String))
      expect(response.data.requestById).toHaveProperty('storeName', expect.any(String))
      expect(response.data.requestById).toHaveProperty('items')
      expect(response.data.requestById).toHaveProperty('createdAt')
      expect(response.data.requestById).toHaveProperty('updatedAt')
      expect(response.data.requestById).toHaveProperty('status', expect.any(String))
    })

    test('REQUEST_WITH_PO: should return specific data', async () => {
      const REQUEST_WITH_PO = `
        query requestsWithPO($idStoreReq: ID!, $access_token: String!) {
          requestsWithPO(idStoreReq: $idStoreReq, access_token: $access_token) {
            request {
              _id
              storeId
              storeName
              items {
                itemId
                itemName
                quantityRequest
                storageQuantity
              }
              createdAt
              updatedAt
              status
            }
            dropdown {
              name
              PO {
                _id
                current_quantity
              }
            }
          }
        }
      `

      const input = {
        idStoreReq: requestId,
        access_token: access_token_warehouseadmin
      }
      // console.log(access_token_warehouseadmin, 'ini apa apa apa')

      const response = await query({ query: REQUEST_WITH_PO, variables: input})
      // console.log(response, 'ini dari test terbaru 2021')
      expect(response.data.requestsWithPO).toHaveProperty('request')
      expect(response.data.requestsWithPO).toHaveProperty('dropdown')
    })
  })

  describe('Store request fail case', () => {
    //Provided wrong access_token
    test('CREATE_REQUEST: should return error', async () => {
      const CREATE_STORE_REQUEST = `
        mutation createRequest($request: RequestInput!, $access_token: String!){
          createRequest(request: $request, access_token: $access_token) {
            _id
            storeName
            items {
              itemId
              itemName
              quantityRequest
            },
            createdAt
            updatedAt
            status
          }
        }
      `
      const input = {
        storeName: 'Toko Di Depan',
        items: [
          {
            itemId: itemData1._id,
            itemName: itemData1.name,
            quantityRequest: 10
          },
          {
            itemId: itemData2._id,
            itemName: itemData2.name,
            quantityRequest: 8
          }
        ]
      }
  
      const response = await mutate({ mutation: CREATE_STORE_REQUEST, variables: { request: input, access_token: access_token_checker }})
      console.log(response.errors, 'error create store request')
      expect(response.errors).toBeDefined()
    })

    test('FIND_BY_ID: should return specific store request data', async () => {
      const FIND_BY_ID = `
        query requestById($id: ID!) {
          requestById(id: $id) {
            _id
            storeName
            items {
              itemId
              itemName
              quantityRequest
            },
            createdAt
            updatedAt
            status
          }
        }
      `
      
  
      const response = await query({ query: FIND_BY_ID, variables: {id: itemData1._id}})

      // console.log(response, 'ini dari findbyid yg gagal')
      // expect(typeof response.data.request).toEqual('object')
      expect(response.data.requestById).toEqual(null)
    })

    test('REQUEST_WITH_PO: should return error', async () => {
      const REQUEST_WITH_PO = `
        query requestsWithPO($idStoreReq: ID!, $access_token: String!) {
          requestsWithPO(idStoreReq: $idStoreReq, access_token: $access_token) {
            request {
              _id
              storeName
              items {
                itemId
                itemName
                quantityRequest
              }
              createdAt
              updatedAt
              status
            }
            dropdown {
              name
              PO {
                _id
                current_quantity
              }
            }
          }
        }
      `

      const input = {
        idStoreReq: requestId,
        access_token: access_token_buyer
      }

      const response = await query({ query: REQUEST_WITH_PO, variables: input})
      // console.log(response, 'ini dari test terbaru 2021 dari yg error')
      expect(response.errors).toBeDefined()
    })
  })
})