const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const poHistory = require('../models/pohistories')
const { query, mutate } = createTestClient(server);

describe('PO History test', () => {
  let idPO;
  let purchasingOrder
  let access_token_buyer;
  let userBuyer
  beforeAll(async () => {
    await connect()

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
        email: "buyer@mail.com",
        password: "123456",
        role: "buyer",
        name: "user1"
    }

    const USER_LOGIN = `
      mutation login($input: UserLoginInput) {
        login(input: $input){
          access_token
        }
      }
    `;
  
    const input = {
      "email": "buyer@mail.com",
      "password": "123456"
    }
  
    // act
    
  
    // act
    
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
  
    const responseUser = await mutate({ mutation: USER_REGISTER, variables: {user} });
    // console.log(responseUser.data)
    userBuyer = responseUser.data.createUser

    const response = await mutate({ mutation: USER_LOGIN, variables: {input} });
    // console.log(response)

    access_token_buyer = response.data.login.access_token

    // act
    const responsePO = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
    // console.log(responsePO)
    purchasingOrder = responsePO.data.createPurchasingOrder
    idPO = responsePO.data.createPurchasingOrder._id

  })
  
  afterAll(async () => {
    await getDatabase().collection('pohistories').deleteMany({})
  })

  describe('PO History success case', () => {
    test('CREATE_PO_HISTORY: should return data with specific properties', async () => {
      // const input =
      // console.log(response)
      const input = {...purchasingOrder}
      input.poId = input._id
      input.user = userBuyer
      delete input._id
      
      const response = await poHistory.create(input)
      // console.log(response.ops)
      expect(response.ops[0]).toHaveProperty('vendorName')
      expect(response.ops[0]).toHaveProperty('status')
      expect(response.ops[0]).toHaveProperty('items')
      expect(response.ops[0]).toHaveProperty('createdAt')
      expect(response.ops[0]).toHaveProperty('updatedAt')
      expect(response.ops[0]).toHaveProperty('expiredDate')
      expect(response.ops[0]).toHaveProperty('poId')
      expect(response.ops[0]).toHaveProperty('user')
      expect(response.ops[0]).toHaveProperty('_id')
    })

    test('FIND_ALL_PO_HISTORIES: should return list of po histories data', async () => {
      const FIND_ALL = `
        query poHistories {
          poHistories {
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
            user {
              _id
              name
              role
              email
            }
            poId
          }
        }
      `

      const response = await query ({ query: FIND_ALL, variables: {}})
      // console.log(response, 'ini dari find all')
      expect(typeof response.data.poHistories).toEqual('object')
    })

    test('FIND_BY_ID: should return all po histories data with specific po id', async () => {
      const FIND_BY_ID = `
        query poHistoriesByPoId($poId: ID!) {
          poHistoriesByPoId(poId: $poId) {
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
            user {
              _id
              name
              role
              email
            }
            poId
          }
        }
      `


      const response = await query({ query: FIND_BY_ID, variables: {poId: idPO}})
      // console.log(response, 'aowkoawk')


      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('vendorName')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('status')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('items')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('createdAt')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('updatedAt')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('expiredDate')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('poId')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('user')
      expect(response.data.poHistoriesByPoId[0]).toHaveProperty('_id')
    })
  })

  describe('PO History fail case', () => {
    test('FIND_BY_ID: data poHistoriesByPoId to be null', async () => {
      const FIND_BY_ID = `
        query poHistoriesByPoId($poId: ID!) {
          poHistoriesByPoId(poId: $poId) {
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
            user {
              _id
              name
              role
              email
            }
            poId
          }
        }
      `

      idPO ='60580e99384f742bccf26391'
      
      const response = await query({ query: FIND_BY_ID, variables: {poId: idPO}})

      // console.log(response, 'ini apa error')
      expect(response.data.poHistoriesByPoId.length).toEqual(0)
    })
  })
})