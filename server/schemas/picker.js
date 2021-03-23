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
      broadcastPicker(access_token: String) : AllBroadCastPicker
      broadcastPickerById(access_token: String, id: ID!) : BroadcastPickerResult
    }

    extend type Mutation {
      pickerUpdateItem(input: BroadcastPickerInput, access_token: String): String 
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
                }
              }
              broadcastForPickers.push(broadcast)
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

          allBroadcast.forEach(broadcast => {
            if (broadcast.pickerId) {
              if (decoded._id === broadcast.pickerId) {
                throw { type: "CheckerError", message: "Redundant Task" }
              }
            }
          })

          //add key to brodcast
          let foundBroadCast = await Broadcast.findOne(args.id)
          delete foundBroadCast._id
          foundBroadCast.pickerId = decoded._id

          // console.log(foundBroadCast)

          const updatedBroadcast = await Broadcast.updateOne(args.id, foundBroadCast)
          //   console.log(updatedBroadcast)
          return updatedBroadcast
        } catch (err) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      }
    },
    Mutation: {
      pickerUpdateItem: async (_, args) => {
        try {
          const authorize = await authorization(args.access_token, "picker")
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }

          
          args.input.listItem.forEach(async (item) => { //pisang
            let n = 0
            item.listPO.forEach(async (po,indexPO) => {
              let foundItem = await Item.findOneById(item.idItem)
              console.log(foundItem, 'index: ',indexPO)
              let foundPO = await PurchasingOrder.findById(po.idPO)
              let arrItems = [...foundPO.items]

              foundPO.items.forEach(async (itemPO, index) => {
                if (itemPO.name.toLowerCase() === item.itemName.toLowerCase()){
                  arrItems[index].currentQuantity -=  po.quantity
                  n+=po.quantity
                }
              })

              const payload = {
                items: [...arrItems],
                status: "clear",
                updatedAt: new Date()
              }
              const updatePO = await PurchasingOrder.updateCurrentQuantity(foundPO._id, payload)

            // console.log(n)  
            const updateItem = await Item.updateOne(foundItem._id, foundItem.quantity-n)
            })
          })

          const deletedBroadcast = await Broadcast.deleteOne(args.input.idBroadcast)
          return "Request Successfully Handled"
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError("bad request", "404", err)
        }
      }
    }
  }
}