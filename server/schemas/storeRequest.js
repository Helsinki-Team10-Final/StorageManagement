const { gql, ApolloError } = require("apollo-server")
const { authorization } = require('../helpers/authorize')
const PurchasingOrder = require('../models/purchasingOrder')
const Broadcast = require('../models/broadcast')
const StoreRequest = require('../models/storeRequest')
const { decodedToken } = require('../helpers/jwt')


module.exports = {
  typeDefs: gql`

  type ItemReq {
    itemId: ID!
    itemName: String
    quantityRequest: Int
  }

  type Request {
    _id: ID!
    storeName: String
    items: [ItemReq]
    createdAt: Date
    updatedAt: Date
    status: String
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
    request(id: ID!): Request
  }

  extend type Mutation {
    createRequest(request: RequestInput, access_token: String): Request
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

      request: async (_, args) => {
        try {
          const foundRequest = await StoreRequest.findById(args.id)
          return foundRequest
        } catch(err) {
          return new ApolloError(error)
        }
      },
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

      // createBroadcastPicker: async (_, args) => {
      //   try {
      //     const authorize = await authorization(args.access_token, "buyer")
      //     if (!authorize) throw { type: "CustomError", message: "Not authorize" }
      //     const pickerLogin = decodedToken(access_token)
      //     const foundStoreReq = await StoreRequest.findById(args.idStoreReq)
      //     console.log(foundStoreReq)
      //     // const broadcast = {
      //     //   storeRequest: foundStoreReq,
      //     //   role: args.role
      //     // }
      //     // const newBroadcast = await Broadcast.create(broadcast)
      //     // // console.log(broadcast)
      //     // // return newBroadcast.ops[0]
      //     //create broadcast for picker
      //     const broadcast = {
      //       storeRequest: newStoreReq.ops[0],
      //       role: "picker"
      //     }
      //     const newBroadcast = await Broadcast.create(broadcast)
      //     // console.log(broadcast)
      //     // return newBroadcast.ops[0]
      //     return
      //   } catch (err) {
      //     console.log(err)
      //     return new ApolloError("bad request", "404", err)
      //   }
      // }
    }
  }
}