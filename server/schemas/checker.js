const { gql, ApolloError } = require('apollo-server')
const { authorization } = require('../helpers/authorize')
const { decodedToken } = require('../helpers/jwt')
const Broadcast = require('../models/broadcast')
const PurchasingOrder = require('../models/purchasingOrder')

module.exports = {
  typeDefs: gql`
  
    type AllBroadCast {
      broadcasts: [BroadCast]
      unfinishedBroadcast: BroadCast
    }

    extend type Query {
      broadcastChecker(access_token: String) : AllBroadCast
      broadcastCheckerById(access_token: String, id: ID!) : BroadCast
    }

    extend type Mutation {
      checkerUpdateItem(id: ID!, quantity: Int, access_token: String): Item
      updateStatusPurchasingOrderChecker(id: ID!, access_token: String) : PurchasingOrder
    }
  `,
  resolvers: {
    Query: {
      async broadcastChecker(_, args) {
        try {
          console.log(args)
          const authorize = await authorization(args.access_token, "checker")
          // console.log(authorize)
          if (!authorize) throw {type: "CustomError", message: "Not authorize"}
          const checkerData = decodedToken(args.access_token)
          // console.log(checkerData, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')

          let unfinishedBroadcast

          const allBroadcast = await Broadcast.find()
        
          // console.log(allBroadcast)
          const broadcastForCheckers = []
          
          allBroadcast.forEach(broadcast => {
            if (broadcast.role === 'checker' && broadcast.purchasingOrder.status === 'checking') {
              if (broadcast.checkerId) {
                if (broadcast.checkerId === checkerData._id) {
                  unfinishedBroadcast = broadcast
                }
              }
              broadcastForCheckers.push(broadcast)
            }
          })
          return { broadcasts: broadcastForCheckers, unfinishedBroadcast }
        } catch(err) {
          console.log(err)
          return new ApolloError("bad request","404",err)
        }
      },
      async broadcastCheckerById(_, args) {
        try {
          const authorize = await authorization(args.access_token, "checker")
          // console.log(authorize)
          if (!authorize) throw {type: "CustomError", message: "Not authorize"}

          const decoded = await decodedToken(args.access_token)

          const allBroadcast = await Broadcast.find()

          allBroadcast.forEach(broadcast => {
            if (broadcast.checkerId) {
              if (decoded._id === broadcast.checkerId) {
                throw {type: "CheckerError", message: "Redundant Task"}
              }
            }
          })

          //add key to brodcast
          let foundBroadCast = await Broadcast.findOne(args.id)
          delete foundBroadCast._id
          foundBroadCast.checkerId = decoded._id
          
          // console.log(foundBroadCast)

          const updatedBroadcast = await Broadcast.updateOne(args.id, foundBroadCast)
          console.log(updatedBroadcast)
          return updatedBroadcast
        } catch(err) {
          console.log(err)
          return new ApolloError("bad request","404",err)
        }
      }
    },
    Mutation: {
      checkerUpdateItem: async(_, args) => {
        try {
          // console.log(args,'-------')
          const authorize = await authorization(args.access_token, "checker")
          if (!authorize) throw {type: "CustomError", message: "Not authorize"}

          let item = await Item.findOne(args.id)
          item.quantity += args.quantity
          let updatedItem = await Item.updateOne(args.id, {quantity: item.quantity})
          return updatedItem
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      }
      // async updateStatusPurchasingOrderChecker(_, args) {
      //   try {
      //     const authorize = authorization(args.access_token, "checker")
      //     if (!authorize) throw {type: "CustomError", message: "Not authorize"}
      //     const payload = {
      //       status: "clear",
      //       updatedAt: new Date()
      //     }
      //     const updatedStatusPurchasingOrder = await PurchasingOrder.updateStatus(args.id, payload)
      //     // console.log(updatedStatusPurchasingOrder)
      //     return updatedStatusPurchasingOrder.value
      //   } catch(err) {
      //     console.log(err)
      //     return new ApolloError("bad request","404",err)
      //   }
      // }
    }
  }
}