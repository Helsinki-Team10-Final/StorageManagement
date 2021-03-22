const server = require('../app')
const { connect, getDatabase } = require('../config/mongodb')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);

describe('Test storage child', () => {
  beforeAll(async () => {
    await connect()
  })
  afterAll(async () => {
    await getDatabase().collection('storeage_child').deleteMany({})
  })

  describe('Storage child success case', () => {
    test('CREATE_STORAGE_CHILD: should return storage child data with specific properties', async () => {
      const CREATE_STORAGE_CHILD = `
        mutation createStore($store: CreateStorageChild) {
          createStore(store: $store) {
            _id
            name
            item {
              name
              quantity
            }
            createdAt
            updatedAt
          }
        }
      `

      const input = {
        name: 'TokoT',
        item: [
          {
            name: 'semongko',
            quantity: 12
          },
          {
            name: 'monggo',
            quantity: 11
          }
        ]
      }

      const response = await mutate({ mutation: CREATE_STORAGE_CHILD, variables: input})
      expect(response.data.createStore).toHaveProperty('_id')
      expect(response.data.createStore).toHaveProperty('name')
      expect(response.data.createStore).toHaveProperty('item')
      expect(response.data.createStore).toHaveProperty('createdAt')
      expect(response.data.createStore).toHaveProperty('updatedAt')
    })

    test('FIND_STORAGE_CHILD: should retun list of all storage child data', async () => {
      const FIND_STORAGE_CHILD = `
        query stores {
          stores
        }
      `

      const response = await query({ query: FIND_STORAGE_CHILD, variables: {}})
      expect(response.data.stores).toHaveProperty('stores')
    })
  })
})