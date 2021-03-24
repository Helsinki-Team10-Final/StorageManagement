const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const Store = require('../models/store')

describe('Picker Test', () => {
  let idPO1;
  let idPO2;
  let broadcastPicker;
  let idBroadCast1
  let idBroadCast2
  let itemData1
  let itemData2
  let pickerId1;
  let pickerId2;
  let access_token_buyer
  let access_token_checker
  let access_token_warehouseadmin
  let access_token_picker1;
  let access_token_picker2;
  let createdAt
  let storeReq
  let idStoreReq
  let store1
  let store2
  
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

    const picker1 = {
        "email": "picker@mail.com",
        "password": "123456",
        "role": "picker",
        "name": "user2"
    }

    const picker2 = {
        "email": "picker2@mail.com",
        "password": "123456",
        "role": "picker",
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

    const picker_login = {
      "email": "picker@mail.com",
      "password": "123456"
    }

    const picker_login2 = {
      "email": "picker2@mail.com",
      "password": "123456"
    }

    const warehouseadmin_login = {
      "email": "warehouseadmin@mail.com",
      "password": "123456"
    }

    //Purchasing Order
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
            "quantity": 80
          },
          {
            "name": "lemper",
            "quantity": 50
          }
        ]
    }

    //Register
    await mutate({ mutation: USER_REGISTER, variables: {input: buyer} });
    await mutate({ mutation: USER_REGISTER, variables: {input: checker} });
    await mutate({ mutation: USER_REGISTER, variables: {input: warehouseadmin} });
    const responsePickerId1 = await mutate({ mutation: USER_REGISTER, variables: {input: picker1} });
    const responsePickerId2 = await mutate({ mutation: USER_REGISTER, variables: {input: picker2} });
    pickerId1 = responsePickerId1.data.createUser._id
    pickerId2 = responsePickerId2.data.createUser._id
    // console.log(responsePickerId, 'ini ini ini')

    //Login
    const responseBuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    const responseChecker = await mutate({ mutation: USER_LOGIN, variables: {input: checker_login} });
    const responsePicker = await mutate({ mutation: USER_LOGIN, variables: {input: picker_login} });
    const responsePicker2 = await mutate({ mutation: USER_LOGIN, variables: {input: picker_login} });
    const responseWarehouseadmin = await mutate({ mutation: USER_LOGIN, variables: {input: warehouseadmin_login} });
    access_token_buyer = responseBuyer.data.login.access_token
    access_token_checker = responseChecker.data.login.access_token
    access_token_picker1 = responsePicker.data.login.access_token
    access_token_picker2 = responsePicker2.data.login.access_token
    access_token_warehouseadmin = responseWarehouseadmin.data.login.access_token

    //Create PO
    const responsePO1 = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
    const responsePO2 = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input2, access_token: access_token_buyer} });
    idPO1 = responsePO1.data.createPurchasingOrder._id
    idPO2 = responsePO2.data.createPurchasingOrder._id
    createdAt = responsePO1.data.createPurchasingOrder.createdAt

    //Item
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
      name: "lemper"
    }

    const itemInput2 = {
      name: "yamin"
    }

    //Create Item
    const responseItem1 = await mutate({ mutation: CREATE_ITEM, variables: { input: itemInput1 } });
    const responseItem2 = await mutate({ mutation: CREATE_ITEM, variables: { input: itemInput2 } });
    // console.log(responseItem1, 'ini response item')
    // console.log(responsePO, 'ini PO nya ya')
    itemData1 = responseItem1.data.createItem
    itemData2 = responseItem2.data.createItem

    //Create Store
    const inputStore1 = {
      name: 'Toko A'
    }

    const inputStore2 = {
      name: 'Toko B'
    }
    

    const responseStore1 = await Store.create(inputStore1)
    const responseStore2 = await Store.create(inputStore2)
    store1 = responseStore1.ops[0]
    store2 = responseStore2.ops[0]

  const CREATE_STORE_REQUEST = `
    mutation createRequest($request: RequestInput!, $access_token: String!){
      createRequest(request: $request, access_token: $access_token) {
        _id
        storeId
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
    storeName: store1.name,
    storeId: `${store1._id}`,
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

    const responseStoreReq = await mutate({ mutation: CREATE_STORE_REQUEST, variables: { request: input, access_token: access_token_buyer }})
    storeReq = responseStoreReq.data.createRequest
    idStoreReq = responseStoreReq.data.createRequest._id
    // console.log(responseStoreReq, 'ini store req')

    //Picker Broadcast
    const PICKER_BROADCAST = `
        mutation createBroadcastPicker($idStoreReq: ID!, $access_token: String!, $itemsToPick:[itemToPickInput]!) {
          createBroadcastPicker(idStoreReq: $idStoreReq, access_token: $access_token, itemsToPick: $itemsToPick) {
            _id
            role
            listItem {
              idItem
              itemName
              listPO {
                idPO
                quantity
              }
            }
            pickerId
            StoreReq {
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
          }
        }
      `
    
    const inputBroadcast1 = {
      idStoreReq,
      access_token: access_token_warehouseadmin,
      itemsToPick: [
        {
          idItem: itemData1._id,
          itemName: itemData1.name,
          listPO: [
            {
              idPO: idPO1,
              quantity: 10
            },
            {
              idPO: idPO2,
              quantity: 4
            }
          ]
        },
        {
          idItem: itemData2._id,
          itemName: itemData2.name,
          listPO: [
            {
              idPO: idPO2,
              quantity: 8
            }
          ]
        }
      ]
    }

    const inputBroadcast2 = {
      idStoreReq,
      access_token: access_token_warehouseadmin,
      itemsToPick: [
        {
          idItem: itemData1._id,
          itemName: itemData1.name,
          listPO: [
            {
              idPO: idPO1,
              quantity: 10
            },
            {
              idPO: idPO2,
              quantity: 4
            }
          ]
        },
        {
          idItem: itemData2._id,
          itemName: itemData2.name,
          listPO: [
            {
              idPO: idPO2,
              quantity: 8
            }
          ]
        }
      ]
    }
    
    //Create Broadcast
    const responseBroadcast1 = await mutate({ mutation: PICKER_BROADCAST, variables: inputBroadcast1 });
    const responseBroadcast2 = await mutate({ mutation: PICKER_BROADCAST, variables: inputBroadcast2 });
    // console.log(responseBroadcast1, 'ini response bBC')
    // console.log(responseBroadcast1.data.createBroadcastPicker.StoreReq, 'ini response bBC')
    // console.log(responseBroadcast1.data.createBroadcastPicker.listItem)
    // console.log(responseBroadcast1.data.createBroadcastPicker.StoreReq)
    broadcastPicker = responseBroadcast1.data.createBroadcastPicker
    idBroadCast1 = responseBroadcast1.data.createBroadcastPicker._id
    idBroadCast2 = responseBroadcast2.data.createBroadcastPicker._id

  })

  afterAll(async () => {
    // console.log('ini after all')
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('purchasingorder').deleteMany({})
    await getDatabase().collection('broadcasts').deleteMany({})
    await getDatabase().collection('items').deleteMany({})
    await getDatabase().collection('storerequest').deleteMany({})
    await getDatabase().collection('store').deleteMany({})
  })

  describe('Picker success case', () => {

    test('FIND_BY_ID: should return picker broadcast detail data with specific properties', async () => {
      const FIND_BY_ID = `
        query broadcastPickerById($access_token: String!, $id: ID!) {
          broadcastPickerById(access_token: $access_token, id: $id) {
            _id
            role
            listItem {
              idItem
              itemName
              listPO {
                idPO
                quantity
              }
            },
            pickerId
            StoreReq {
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
        }
      `

      const response = await query({ query: FIND_BY_ID, variables: {access_token: access_token_picker1, id: idBroadCast2 }})
      const response2 = await query({ query: FIND_BY_ID, variables: {access_token: access_token_picker1, id: idBroadCast1 }})
      const response3 = await query({ query: FIND_BY_ID, variables: {access_token: access_token_picker1, id: idBroadCast2 }})
      // console.log(response)
      expect(response.data.broadcastPickerById).toHaveProperty('_id')
      expect(response.data.broadcastPickerById).toHaveProperty('role')
      expect(response.data.broadcastPickerById).toHaveProperty('listItem')
      expect(response.data.broadcastPickerById).toHaveProperty('pickerId')
      expect(response.data.broadcastPickerById).toHaveProperty('StoreReq')
    })

    test('FIND_ALL: should return all picker broadcast data', async () => {
      const FIND_ALL = `
        query broadcastPicker($access_token: String!) {
          broadcastPicker(access_token: $access_token) {
            broadcasts {
              _id
              role
              listItem {
                idItem
                itemName
                listPO {
                  idPO
                  quantity
                }
              },
              pickerId
              StoreReq {
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
            unfinishedBroadcast {
              _id
              role
              listItem {
                idItem
                itemName
                listPO {
                  idPO
                  quantity
                }
              },
              pickerId
              StoreReq {
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
          }
        }
      `

      const response = await query({ query: FIND_ALL, variables:{ access_token: access_token_picker1 }})
      // console.log(response.data)
      expect(response.data.broadcastPicker).toHaveProperty('broadcasts')
      expect(response.data.broadcastPicker).toHaveProperty('unfinishedBroadcast')
    })

    test('UPDATE_ITEM: should return updated broadcast data with specific properties', async () => {
      const UPDATE_ITEM = `
        mutation pickerUpdateItem($input: BroadcastPickerInput, $access_token: String!, $idStoreReq: ID!) {
          pickerUpdateItem(input: $input, access_token: $access_token, idStoreReq: $idStoreReq)
        }
      `

      const input = {
        idBroadcast: idBroadCast1,
        role: 'picker',
        listItem: [
          {
            idItem: itemData1._id,
            itemName: itemData1.name,
            listPO: [
              {
                idPO: idPO1,
                quantity: 8
              },
              {
                idPO: idPO2,
                quantity: 7
              }
            ]
          },
          {
            idItem: itemData2._id,
            itemName: itemData2.name,
            listPO: [
              {
                idPO: idPO1,
                quantity: 3
              },
              {
                idPO: idPO2,
                quantity: 2
              }
            ]
          }
        ],
        pickerId: pickerId1,
        StoreReq: {
          storeId: idStoreReq,
          storeName: storeReq.storeName,
          items: [
            {
              itemId: itemData1._id,
              itemName: itemData1.name,
              quantityRequest: 15
            },
            {
              itemId: itemData2._id,
              itemName: itemData2.name,
              quantityRequest: 5
            }
          ]
        }
      }

      const response = await mutate({ mutation: UPDATE_ITEM, variables: { input, access_token: access_token_picker1, idStoreReq }})
      // console.log(response, 'ini dari picker update testotesto')
      expect(response.data.pickerUpdateItem).toEqual('Items Picked Successfully', expect.any(String))
    })
  })

  describe('Picker fail case', () => {

    test('FIND_ALL: should return error when provided wrong access token', async () => {
      const FIND_ALL = `
        query broadcastPicker($access_token: String) {
          broadcastPicker(access_token: $access_token) {
            broadcasts {
              _id
              role
              listItem {
                idItem
                itemName
                listPO {
                  idPO
                  quantity
                }
              },
              pickerId
              StoreReq {
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
            unfinishedBroadcast {
              _id
              role
              listItem {
                idItem
                itemName
                listPO {
                  idPO
                  quantity
                }
              },
              pickerId
              StoreReq {
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
          }
        }
      `

      const response = await query({ query: FIND_ALL, variables:{ access_token: access_token_buyer}})
      // console.log(response.data.broadcastPicker.broadcasts)
      // console.log(response)
      expect(response.errors).toBeDefined()
    })

    test('FIND_BY_ID: should return error when provided wrong access token', async () => {
      const FIND_BY_ID = `
        query broadcastPickerById($access_token: String!, $id: ID!) {
          broadcastPickerById(access_token: $access_token, id: $id) {
            _id
            role
            listItem {
              idItem
              itemName
              listPO {
                idPO
                quantity
              }
            },
            pickerId
            StoreReq {
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
        }
      `

      const response = await query({ query: FIND_BY_ID, variables: {access_token: access_token_buyer, id: idBroadCast2 }})
      // console.log(response.data.broadcastPickerById.listItem)
      expect(response.errors).toBeDefined()
    })

    test('UPDATE_ITEM: should return error when provided wrong access token', async () => {
      const UPDATE_ITEM = `
        mutation pickerUpdateItem($input: BroadcastPickerInput!, $access_token: String!, $idStoreReq: ID!) {
          pickerUpdateItem(input: $input, access_token: $access_token, idStoreReq: $idStoreReq)
        }
      `

      const input = {
        idBroadcast: idBroadCast1,
        role: 'picker',
        listItem: [
          {
            idItem: itemData1._id,
            itemName: itemData1.name,
            listPO: [
              {
                idPO: idPO1,
                quantity: 8
              },
              {
                idPO: idPO2,
                quantity: 7
              }
            ]
          },
          {
            idItem: itemData2._id,
            itemName: itemData2.name,
            listPO: [
              {
                idPO: idPO1,
                quantity: 3
              },
              {
                idPO: idPO2,
                quantity: 2
              }
            ]
          }
        ],
        pickerId: pickerId1,
        StoreReq: {
          storeId: idStoreReq,
          storeName: storeReq.storeName,
          items: [
            {
              itemId: itemData1._id,
              itemName: itemData1.name,
              quantityRequest: 15
            },
            {
              itemId: itemData2._id,
              itemName: itemData2.name,
              quantityRequest: 5
            }
          ]
        }
      }

      const response = await mutate({ mutation: UPDATE_ITEM, variables: { input, access_token: access_token_buyer, idStoreReq }})
      // console.log(response)
      expect(response.errors).toBeDefined()
    })
  })
})