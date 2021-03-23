const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);

describe('Store Request Test', () => {
  let access_token_buyer;
  let access_token_checker;
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
      name: "semangka"
    }

    const itemInput2 = {
      name: "jeruk"
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
      //Login
    const responseBuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    const responseChecker = await mutate({ mutation: USER_LOGIN, variables: {input: picker_login} });
    // console.log(responseChecker.data.login.access_token, 'iini dari beforeall token token punya CHECKER')
    // console.log(responsePicker.data.login.access_token, 'iini dari beforeall token token punya PICKER')
    access_token_buyer = responseBuyer.data.login.access_token
    access_token_picker = responseChecker.data.login.access_token
  })

  afterAll(async () => {
    await getDatabase().collection('storerequests').deleteMany({})
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('storerequests').deleteMany({})
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
      console.log(response.data, 'ini dari findbyid')
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
        access_token: access_token_picker
      }

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
        mutation createRequest($request: RequestInput, $access_token: String){
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
  
      const response = await mutate({ mutation: CREATE_STORE_REQUEST, variables: { request: input, access_token: access_token_picker }})
      // console.log(response.errors)
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
        query requestsWithPO($idStoreReq: ID!, $access_token: String) {
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