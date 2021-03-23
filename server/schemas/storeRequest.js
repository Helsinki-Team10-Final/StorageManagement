const { gql, ApolloError } = require("apollo-server")
const { authorization } = require('../helpers/authorize')
const PurchasingOrder = require('../models/purchasingOrder')
const Broadcast = require('../models/broadcast')
const StoreRequest = require('../models/storeRequest')
const { decodedToken } = require('../helpers/jwt')
const Store = require("../models/store")
const Item = require("../models/item")


module.exports = {
  typeDefs: gql`

  type ItemReq {
    itemId: ID!
    itemName: String
    quantityRequest: Int
    storageQuantity: Int
  }

  type Request {
    _id: ID!
    storeName: String
    items: [ItemReq]
    createdAt: Date
    updatedAt: Date
    status: String
  }

  type PO {
    _id: String
    current_quantity: Int
  }

  type RequestWithPO {
    name: String
    PO: [PO]
  }

  type DataRequestBroadCastPicker {
    request: Request
    dropdown: [RequestWithPO]
  }

  input ItemReqInput {
    itemId: ID!
    itemName: String
    quantityRequest: Int
  }

  input RequestInput {
    storeName: String
    items: [ItemReqInput]
  }

  extend type Query {
    requests: [Request]
    requestById(id: ID!): Request
    requestsWithPO(idStoreReq: ID!, access_token: String!): DataRequestBroadCastPicker
  }

  extend type Mutation {
    createRequest(request: RequestInput!, access_token: String!): Request
  }
  `,
  resolvers: {
    Query: {
      requests: async () => {
        try {
          const requests = await StoreRequest.findAll()
          // console.log(requests)
          return requests
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },

      requestById: async (_, args) => {
        try {
          const foundRequest = await StoreRequest.findById(args.id)
          const tempArr = []
          const result = JSON.parse(JSON.stringify(foundRequest))
          for (i=0; i<foundRequest.items.length; i++){
            let item = foundRequest.items[i]
            let foundItem = await Item.findOneById(item.itemId)
            const tempItem = {
              itemId : item.itemId,
              itemName: item.itemName,
              quantityRequest: item.quantityRequest,
              storageQuantity: foundItem.quantity
            }
            tempArr.push(tempItem)
            result.items = [...tempArr]
          }
          // console.log(result)
          return result          
        } catch(err) {
          return new ApolloError(error)
        }
      },

      async requestsWithPO(_, args) {
        try {
          const authorize = await authorization(args.access_token, "warehouseadmin")
          // console.log(authorize)
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }

          const foundStoreReq = await StoreRequest.findById(args.idStoreReq)
          const listItem = foundStoreReq.items
          // console.log(listItem)

          const allItemsWithPO = []

          for (let i = 0; i < listItem.length; i++) {
            console.log(listItem[i].itemName, '<<<<<<<<<<<<<<<<<<')
            let poPerItem = []
            const foundPO = await PurchasingOrder.findAllByItemName(listItem[i].itemName)
            foundPO.forEach(po => {
              const item = po.items.filter(item => item.name === listItem[i].itemName)
              poPerItem.push({
                _id: po._id,
                current_quantity: item[0].currentQuantity
              })
            })

            let obj = {
              name: listItem[i].itemName,
              PO: poPerItem
            }
            allItemsWithPO.push({...obj})
          }

          return {request: foundStoreReq, dropdown: allItemsWithPO}
          // console.log(foundStoreReq)
        } catch(err) {
          console.log(err)
        }
      }
    },
    Mutation: {
      createRequest: async (_, args) => {
        try {
          const authorize = await authorization(args.access_token, "buyer")
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }

          //create request
          const payload = {
            storeName: args.request.storeName,
            items: args.request.items,
            updatedAt: new Date(),
            createdAt: new Date(),
            status: "process"
          }
          const newStoreReq = await StoreRequest.create(payload)
          // console.log(newStoreReq)
          return newStoreReq.ops[0]

        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },
    }
  }
}