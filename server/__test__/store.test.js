const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const Store = require('../models/store')
// const { query, mutate } = createTestClient(server);

describe('Store Test', () => {
  let id;
  beforeAll(async () => {
    await connect()
  })
  
  afterAll(async () => {
    await getDatabase().collection('stores').deleteMany({})
  })

  describe('Store success case', () => {
    test('CREATE_STORE: should return data with specific properties', async () => {
      const input1 = {
        name: 'Toko A'
      }

      const input2 = {
        name: 'Toko B'
      }
      

      const response = await Store.create(input1)
      await Store.create(input2)
      id = response.ops[0]._id
      // console.log(response.ops[0])
      expect(response.ops[0]).toHaveProperty('name', input1.name, expect.any(String))
      expect(response.ops[0]).toHaveProperty('_id')
    })

    test('FIND_ALL_STORE: should return list of store data', async () => {
      const response = await Store.findAll()
      // console.log(response)
      expect(typeof response).toEqual('object')
    })

    test('FIND_BY_ID: should return data with specific detail', async () => {

      const response = await Store.findById(id)
      console.log(response)
      // expect(typeof response).toEqual('object')
      expect(response).toHaveProperty('name', expect.any(String))
      expect(response).toHaveProperty('_id', id)
      
    })
  })
})