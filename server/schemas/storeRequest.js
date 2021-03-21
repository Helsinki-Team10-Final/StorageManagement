const { gql, ApolloError } = require("apollo-server")
const { authorization } = require('../helpers/authorize')
const PurchasingOrder = require('../models/purchasingOrder')
const Broadcast = require('../models/broadcast')
const StoreRequest = require('../models/storeRequest')
const {decodedToken} = require('../helpers/jwt')


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
  }

  type BroadcastPicker {
    _id: ID!
    role: String
    storeRequest: Request
    pickerId: String
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
    createRequest(request: RequestInput): Request
    createBroadcastPicker(idStoreReq: ID!, role:String): BroadcastPicker
  }

  `,
  resolvers: {
    Query: {
      requests: async () => {
        try {
          const requests = await StoreRequest.findAll()
          // console.log(requests)
          return requests
        } catch (error) {console.log(error, '---> error')
          return new ApolloError(error)
        }
      }
    },
    Mutation: {
      createRequest: async (_, args) => {
        try {
          const newStoreReq = await StoreRequest.create(args.request)
          console.log(newStoreReq)
          return newStoreReq.ops[0]
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },

      createBroadcastPicker: async (_, args) => {
        try {
          const authorize = authorization(args.access_token, "buyer")
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }
          const pickerLogin = decodedToken(access_token)
          const foundStoreReq = await StoreRequest.findById(args.idStoreReq)
          console.log(foundStoreReq)
          // const broadcast = {
          //   storeRequest: foundStoreReq,
          //   role: args.role
          // }
          // const newBroadcast = await Broadcast.create(broadcast)
          // // console.log(broadcast)
          // // return newBroadcast.ops[0]
        } catch (err) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      }
    }
  }
}