const { gql, ApolloError } = require('apollo-server')
const { authorization } = require('../helpers/authorize')
const { decodedToken } = require('../helpers/jwt')
const Broadcast = require('../models/broadcast')
const StoreRequest = require('../models/storeRequest')
const Item = require('../models/item')
const PurchasingOrder = require('../models/purchasingOrder')

module.exports = {
  typeDefs: gql`
    type AllBroadCastPicker {
        broadcasts: [BroadcastPickerResult]
        unfinishedBroadcast: BroadcastPickerResult
    }

    input listPOItemInput {
      idPO: String
      quantity: Int
    }

    input itemRequestInput{
      idItem: String
      itemName: String
      listPO: [listPOItemInput]
    }

    input BroadcastPickerInput {
      idBroadcast: String
      role: String
      listItem: [itemRequestInput]
      pickerId: String
      StoreReq: RequestInput
    }

    extend type Query {
      broadcastPicker(access_token: String!) : AllBroadCastPicker
      broadcastPickerById(access_token: String!, id: ID!) : BroadcastPickerResult
    }

    extend type Mutation {
      pickerUpdateItem(input: BroadcastPickerInput!, access_token: String!, idStoreReq: ID!): String 
    }
  `,
  resolvers: {
    Query: {
      async broadcastPicker(_, args) {
        try {
          console.log(args)
          const authorize = await authorization(args.access_token, "picker")
          // console.log(authorize)
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }
          const pickerData = decodedToken(args.access_token)
          // console.log(pickerData, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')

          let unfinishedBroadcast

          const allBroadcast = await Broadcast.find()

          // console.log(allBroadcast)
          const broadcastForPickers = []

          allBroadcast.forEach(broadcast => {
            if (broadcast.role === 'picker' && broadcast.StoreReq.status === 'picking') {
              if (broadcast.pickerId) {
                if (broadcast.pickerId === pickerData._id) {
                  unfinishedBroadcast = broadcast
                } else {
                  broadcastForPickers.push(broadcast)
                }
              }
            }
          })
          return { broadcasts: broadcastForPickers, unfinishedBroadcast }
        } catch (err) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      },
      async broadcastPickerById(_, args) {
        try {
          const authorize = await authorization(args.access_token, "picker")
          // console.log(authorize)
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }

          const decoded = await decodedToken(args.access_token)

          const allBroadcast = await Broadcast.find()
          let hasTask 
          allBroadcast.forEach(broadcast => {
            if (broadcast.pickerId) {
              if (decoded._id === broadcast.pickerId) {
                hasTask = broadcast
                // throw { type: "CheckerError", message: "Redundant Task" }
              }
            }
          })

          //add key to brodcast
          let foundBroadCast = await Broadcast.findOne(args.id)
          if (foundBroadCast.pickerId){
            if (decoded._id === foundBroadCast.pickerId){
              return foundBroadCast
            }
          } else {
            if (!hasTask){
              delete foundBroadCast._id
              foundBroadCast.pickerId = decoded._id
              const updatedBroadcast = await Broadcast.updateOne(args.id, foundBroadCast)
              return updatedBroadcast
            } else {
              throw {type: "CheckerError", message: "Redundant Task"}
            }
          }
          
        } catch (err) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      }
    },
    Mutation: {
      async pickerUpdateItem(_, args) {
        try {
          console.log(args)
        } catch (error) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      }
    }
  }
}