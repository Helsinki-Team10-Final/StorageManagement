const { gql, ApolloError } = require("apollo-server")
const { authorization } = require('../helpers/authorize')
const PurchasingOrder = require('../models/purchasingOrder')
const Broadcast = require('../models/broadcast')


module.exports = {
  typeDefs: gql`
    type BroadCast {
      _id: ID
      purchasingOrder: PurchasingOrder
      role: String
    }

    extend type Query {
      brodcasts: [BroadCast]
    }

    extend type Mutation {
      updateStatusPurchasingOrderAdmin(id: ID!, status: String, access_token: String!): PurchasingOrder
      createBroadcast(idPurchasingOrder: ID!, role: String!) : BroadCast
    }

  `,
  resolvers: {
    Query: {
      async brodcasts(_, args) {
        try {
          const authorize = authorization(args.access_token, "warehouseadmin")
          const allBroadcast = await Broadcast.find()
          return allBroadcast
        } catch(err) {

        }
      }
    },
    Mutation: {
      async updateStatusPurchasingOrderAdmin(_, args) {
        try {
          const authorize = authorization(args.access_token, "warehouseadmin")
          if (!authorize) throw {type: "CustomError", message: "Not authorize"}
          const updatedStatusPurchasingOrder = await PurchasingOrder.updateStatusFromAdmin(args.id, args.status)
          console.log(updatedStatusPurchasingOrder)
          return updatedStatusPurchasingOrder.value
        } catch(err) {
          console.log(err)
          return new ApolloError("bad request","404",err)
        }
      }
      // async createBroadcast(_, args) {
      //   try {
      //     const authorize = authorization(args.access_token, "warehouseadmin")
      //     if (!authorize) throw {type: "CustomError", message: "Not authorize"}
      //     const foundPurchasingOrder = await PurchasingOrder.findById(args.idPurchasingOrder)
      //     console.log(foundPurchasingOrder)
      //     const broadcast = {
      //       purchasingOrder: foundPurchasingOrder,
      //       role: args.role
      //     }
      //     const newBroadcast = await Broadcast.create(broadcast)
      //     console.log(broadcast)
      //     return newBroadcast.ops[0]
      //   } catch(err) {
      //     console.log(err)
      //     return new ApolloError("bad request","404",err)
      //   }
      // }
    }
  }
}