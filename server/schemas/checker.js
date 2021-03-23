const { gql, ApolloError } = require('apollo-server')
const { authorization } = require('../helpers/authorize')
const { decodedToken } = require('../helpers/jwt')
const Broadcast = require('../models/broadcast')
const PurchasingOrder = require('../models/purchasingOrder')
const Item = require('../models/item')
const { updateStatus } = require('../models/purchasingOrder')
const POHistory = require('../models/pohistories')

module.exports = {
  typeDefs: gql`

    type UpdateItemResponse {
      message: String
    }

    type AllBroadCast {
      broadcasts: [BroadCast]
      unfinishedBroadcast: BroadCast
    }

    extend type Query {
      broadcastChecker(access_token: String!) : AllBroadCast
      broadcastCheckerById(access_token: String!, id: ID!) : BroadCast
    }

    extend type Mutation {
      checkerUpdateItem(items: [ItemInputUpdate]!, access_token: String!, idPO: String!, idBroadCast: String!): String 
      updateStatusPurchasingOrderChecker(id: ID!, access_token: String) : PurchasingOrder
    }
  `,
  resolvers: {
    Query: {
      async broadcastChecker(_, args) {
        try {
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
              } else {
                broadcastForCheckers.push(broadcast)
              }
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
          let hasTask 
          allBroadcast.forEach(broadcast => {
            if (broadcast.checkerId) {
              if (decoded._id === broadcast.checkerId) {
                hasTask = broadcast
                // throw {type: "CheckerError", message: "Redundant Task"}
              }
            }
          })

          //add key to brodcast
          let foundBroadCast = await Broadcast.findOne(args.id)
          if (foundBroadCast.checkerId) {
            if (decoded._id === foundBroadCast.checkerId) {
              return foundBroadCast
            }
          } else {
            if (!hasTask){
              delete foundBroadCast._id
              foundBroadCast.checkerId = decoded._id
              const updatedBroadcast = await Broadcast.updateOne(args.id, foundBroadCast)
              // console.log(updatedBroadcast)
              return updatedBroadcast
            } else {
              throw {type: "CheckerError", message: "Redundant Task"}
            }
          }
          // 
        } catch(err) {
          console.log(err)
          return new ApolloError("bad request","404",err)
        }
      }
    },
    Mutation: {
      checkerUpdateItem: async(_, args) => {
        try {
          // console.log(args, 'dari skema')
          const authorize = await authorization(args.access_token, "checker")
          if (!authorize) throw {type: "CustomError", message: "Not authorize"}

          // Update / Create Collection Item
          args.items.forEach(async (item) => {
            // console.log(item)
            const foundItem = await Item.findOneByName(item.name.toLowerCase()) //mangga , pisang
            // if not found then create new item
            if (!foundItem) {
              const payload = {
                name: item.name.toLowerCase(),
                quantity: item.currentQuantity
              }
              const newItem = await Item.create(payload)
              console.log(newItem, '-------new item')
            } else {
              // if found then update quantity of that item
              const updatedQuantity = await Item.updateOne(foundItem._id, (+foundItem.quantity + +item.currentQuantity))
              console.log(updatedQuantity, '-------update item')
            }
          })

          // Update PO
          const payload = {
            items: args.items,
            status: 'clear',
            updatedAt: new Date()
          }
          const updatedPurchasingOrder = await PurchasingOrder.updateCurrentQuantity(args.idPO, payload)
          // console.log(updatedPurchasingOrder,'-----update')

          //create history
          let payloadHis = updatedPurchasingOrder.value
          payloadHis.poId = payloadHis._id
          delete payloadHis._id
          payloadHis.user = authorize
          const createPOHistory = await POHistory.create(payloadHis)
          //end create history

          const deletedBroadcast = await Broadcast.deleteOne(args.idBroadCast)
          return "Successfully Checking Purchasing Order"
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError("bad request","404",err)
        }
      }
    }
  }
}