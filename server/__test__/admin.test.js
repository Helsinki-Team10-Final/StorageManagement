const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const Store = require('../models/store')
const { query, mutate } = createTestClient(server);

describe('Admin Test', () => {
  let idPO1;
  let idPO2
  let idStoreReq;
  let access_token_warehouseadmin;
  let access_token_buyer;
  let statusBefore
  let itemData1;
  let itemData2;
  let store1;
  let store2;

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
            "name": "lemper",
            "quantity": 20
          },
          {
            "name": "jeruk",
            "quantity": 10
          }
        ]
    }

    const input2 = {
        "vendorName": "warung mamang",
        "expiredDate": "2021-03-20T04:55:17.064Z",
        "items": [
          {
            "name": "lemper",
            "quantity": 25
          },
          {
            "name": "yamin",
            "quantity": 30
          }
        ]
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
      name: "lemper"
    }

    const itemInput2 = {
      name: "yamin"
    }
      
    //Register
    await mutate({ mutation: USER_REGISTER, variables: {input: warehouseadmin} });
    await mutate({ mutation: USER_REGISTER, variables: {input: buyer} });

    //Login
    const responsewarehouseadmin = await mutate({ mutation: USER_LOGIN, variables: {input: warehouseadmin_login} });
    const responsebuyer = await mutate({ mutation: USER_LOGIN, variables: {input: buyer_login} });
    access_token_warehouseadmin = responsewarehouseadmin.data.login.access_token
    access_token_buyer = responsebuyer.data.login.access_token
    
    const responsePO1 = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input1, access_token: access_token_buyer} });
    const responsePO2 = await mutate({ mutation: CREATE_PURCHASING_ORDER, variables: {input: input2, access_token: access_token_buyer} });

    const responseItem1 = await mutate({ mutation: CREATE_ITEM, variables: { input: itemInput1 } });
    const responseItem2 = await mutate({ mutation: CREATE_ITEM, variables: { input: itemInput2 } });

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
    idStoreReq = responseStoreReq.data.createRequest._id

    // console.log(responseStoreReq, 'response store req')
    idPO1 = responsePO1.data.createPurchasingOrder._id
    idPO2 = responsePO2.data.createPurchasingOrder._id
    createdAt = responsePO1.data.createPurchasingOrder.createdAt
    statusBefore = responsePO1.data.createPurchasingOrder.status
  })

  afterAll(async () => {
    await getDatabase().collection('users').deleteMany({})
    await getDatabase().collection('productorders').deleteMany({})
    await getDatabase().collection('broadcasts').deleteMany({})
    await getDatabase().collection('storerequests').deleteMany({})
    await getDatabase().collection('items').deleteMany({})
  })
  
  describe('Admin Success Case', () => {

    test('REJECT_PO: should return data with specific properties', async () => {
      const REJECT_PO = `
        mutation rejectPurchasingOrder($id: ID!, $access_token: String!) {
          rejectPurchasingOrder(id: $id, access_token: $access_token) {
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
      `
      const input = {
        id: idPO2,
        access_token: access_token_warehouseadmin
      }

      const response = await mutate({ mutation: REJECT_PO, variables: input})
      // console.log(response, 'ini dari reject')
      expect(response.data.rejectPurchasingOrder).toHaveProperty('_id', idPO2, expect.any(String))
      expect(response.data.rejectPurchasingOrder).toHaveProperty('vendorName', expect.any(String))
      expect(response.data.rejectPurchasingOrder).toHaveProperty('status', 'rejected', expect.any(String))
      expect(response.data.rejectPurchasingOrder).toHaveProperty('items')
      expect(response.data.rejectPurchasingOrder).toHaveProperty('createdAt', expect.any(String))
      expect(response.data.rejectPurchasingOrder).toHaveProperty('updatedAt', expect.any(String))
      expect(response.data.rejectPurchasingOrder).toHaveProperty('expiredDate', expect.any(String))

    })

    test('REJECT_STORE_REQUEST: should return data with specific properties', async () => {
      const REJECT_STORE_REQUEST = `
        mutation rejectStoreRequest($id: ID!, $access_token: String!) {
          rejectStoreRequest(id: $id, access_token: $access_token) {
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
        id: idStoreReq,
        access_token: access_token_warehouseadmin
      }

      const response = await mutate({ mutation: REJECT_STORE_REQUEST, variables: input})

      console.log(response, 'dara reject store')
      expect(response.data.rejectStoreRequest).toHaveProperty('_id', expect.any(String))
      expect(response.data.rejectStoreRequest).toHaveProperty('storeName', expect.any(String))
      expect(response.data.rejectStoreRequest).toHaveProperty('items')
      expect(response.data.rejectStoreRequest).toHaveProperty('createdAt', expect.any(String))
      expect(response.data.rejectStoreRequest).toHaveProperty('updatedAt', expect.any(String))
      expect(response.data.rejectStoreRequest).toHaveProperty('status', 'rejected', expect.any(String))
    })
    
    test('CREATE_BROADCAST_CHECKER: should return data with specific properties', async () => {
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

      const input = {
        idPurchasingOrder: idPO1,
        access_token: access_token_warehouseadmin
      }

      const response = await mutate({ mutation: CREATE_BROADCAST_CHECKER, variables: input })
      // console.log(response.data)
      expect(response.data.createBroadcastChecker).toHaveProperty('_id')
      expect(response.data.createBroadcastChecker).toHaveProperty('purchasingOrder')
      expect(response.data.createBroadcastChecker).toHaveProperty('role')
      expect(response.data.createBroadcastChecker).toHaveProperty('checkerId')
    })
    
    test('CREATE_BROADCAST_PICKER: should return data with specific properties', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
    
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
    
      // graphl query

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
    
      const input = {
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
    
      // act
      const response = await mutate({ mutation: PICKER_BROADCAST, variables: input });
      // console.log(response, 'INI RESPONSE BERHASIL')
      // console.log(response.data.createBroadcastPicker.listItem, 'list item')
      // console.log(response.data.createBroadcastPicker.listItem[0].listPO, 'list PO on item 1')
      // console.log(response.data.createBroadcastPicker.listItem[1].listPO, 'list PO on item 2')
      // console.log(response.data.createBroadcastPicker.StoreReq, 'storeRequest')
      // assert
      expect(response.data.createBroadcastPicker).toHaveProperty('_id');
      expect(response.data.createBroadcastPicker).toHaveProperty('listItem');
      expect(response.data.createBroadcastPicker).toHaveProperty('role');
      expect(response.data.createBroadcastPicker).toHaveProperty('pickerId');
      expect(response.data.createBroadcastPicker).toHaveProperty('StoreReq');
    });
  })
  
  describe('Admin Fail Case', () => {
    
    test('UPDATE_STATUS_PO: should return Error', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
      
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
      
      // graphl query
    const UPDATE_STATUS_PO = `
      mutation updateStatusPurchasingOrderAdmin($id: ID!, $status: String!, $access_token: String!) {
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
      id: idPO1,
      status: 'clear',
      access_token: access_token_buyer
    }
  
    // act
    // console.log(statusBefore, 'ini before')
    const response = await mutate({ mutation: UPDATE_STATUS_PO, variables: input });
    
    expect(response.errors).toBeDefined();
    });

    test('CREATE_BROADCAST_CHECKER: should return data with specific properties', async () => {
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

      const input = {
        idPurchasingOrder: idPO1,
        access_token: access_token_buyer
      }

      const response = await mutate({ mutation: CREATE_BROADCAST_CHECKER, variables: input })
      // console.log(response.data)
      expect(response.errors).toBeDefined()
    })

    test('CREATE_BROADCAST_PICKER: should return data with specific properties', async () => {
      // create a new instance of our server (not listening on any port)
      // await connect()
    
      // apollo-server-testing provides a query function
      // in order to execute graphql queries on that server
    
      // graphl query

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
    
      const input = {
        idStoreReq,
        access_token: access_token_buyer,
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
    
      // act
      const response = await mutate({ mutation: PICKER_BROADCAST, variables: input });
      // console.log(response.data.createBroadcastPicker.listItem, 'list item')
      // console.log(response.data.createBroadcastPicker.listItem[0].listPO, 'list PO on item 1')
      // console.log(response.data.createBroadcastPicker.listItem[1].listPO, 'list PO on item 2')
      // console.log(response.data.createBroadcastPicker.StoreReq, 'storeRequest')
      // assert
      expect(response.errors).toBeDefined()
    });

    test('REJECT_PO: should return data with specific properties', async () => {
      const REJECT_PO = `
        mutation rejectPurchasingOrder($id: ID!, $access_token: String!) {
          rejectPurchasingOrder(id: $id, access_token: $access_token) {
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
      `
      const input = {
        id: idPO2,
        access_token: access_token_buyer
      }

      const response = await mutate({ mutation: REJECT_PO, variables: input})
      // console.log(response, 'ini dari reject')
      expect(response.errors).toBeDefined()
    })

    test('REJECT_STORE_REQUEST: should return data with specific properties', async () => {
      const REJECT_STORE_REQUEST = `
        mutation rejectStoreRequest($id: ID!, $access_token: String!) {
          rejectStoreRequest(id: $id, access_token: $access_token) {
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
        id: idStoreReq,
        access_token: access_token_buyer
      }

      const response = await mutate({ mutation: REJECT_STORE_REQUEST, variables: input})

      console.log(response, 'dara reject store')
      expect(response.errors).toBeDefined()
    })
  })
})


