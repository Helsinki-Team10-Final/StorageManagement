const { gql, ApolloError } = require("apollo-server")
const { authorization } = require('../helpers/authorize')
const PurchasingOrder = require('../models/purchasingOrder')
const StoreRequest = require('../models/storeRequest')
const Broadcast = require('../models/broadcast')
const POHistory = require("../models/pohistories")


module.exports = {
  typeDefs: gql`
    type BroadCast {
      _id: ID
      purchasingOrder: PurchasingOrder
      role: String
      checkerId: String
    }

    type listPOItem {
      idPO: String
      quantity: Int
    }

    type itemRequest {
      idItem: String
      itemName: String
      listPO: [listPOItem]
    }

    type BroadcastPickerResult {
      _id: ID!
      role: String
      listItem: [itemRequest]
      pickerId: String
      StoreReq: Request
    }

    input requestPO {
      idPO: String
      quantity: Int
    }

    input itemToPickInput {
      idItem: String
      itemName: String
      listPO: [requestPO]
    }

    extend type Mutation {
      rejectPurchasingOrder(id: ID!, access_token: String!): PurchasingOrder
      rejectStoreRequest(id: ID!, access_token: String!): Request
      createBroadcastChecker(idPurchasingOrder: ID!, access_token: String!) : BroadCast
      createBroadcastPicker(idStoreReq: ID!, access_token: String!, itemsToPick:[itemToPickInput]!): BroadcastPickerResult
    }

  `,
  resolvers: {
    Mutation: {
      async rejectPurchasingOrder(_, args) {
        try {
          const authorize = await authorization(args.access_token, "warehouseadmin")
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }
          const payload = {
            status: "rejected",
            updatedAt: new Date()
          }
          const updatedStatusPurchasingOrder = await PurchasingOrder.updateStatus(args.id, payload)
          // console.log(updatedStatusPurchasingOrder)
          
          //create history
          let payloadHis = updatedStatusPurchasingOrder.value
          payloadHis.poId = payloadHis._id
          delete payloadHis._id
          payloadHis.user = authorize
          const createPOHistory = await POHistory.create(payloadHis)
          //end create history

          return updatedStatusPurchasingOrder.value
        } catch (err) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      },
      async rejectStoreRequest(_, args) {
        try {
          const authorize = await authorization(args.access_token, "warehouseadmin")
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }

          const payload = {
            status: "rejected",
            updatedAt: new Date()
          }
          const updatedStatusUpdateStatus = await StoreRequest.updateStatus(args.id, payload)
          // console.log(updatedStatusUpdateStatus)
          
          return updatedStatusUpdateStatus.value
        } catch (error) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      },
      async createBroadcastChecker(_, args) {
        try {
          const authorize = await authorization(args.access_token, "warehouseadmin")
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }
          const foundPurchasingOrder = await PurchasingOrder.findById(args.idPurchasingOrder)

          //update status PO to checking
          const payload = {
            status: 'checking',
            updatedAt: new Date()
          }
          const updatedStatusPurchasingOrder = await PurchasingOrder.updateStatus(foundPurchasingOrder._id, payload)
          // console.log(updatedStatusPurchasingOrder)

          console.log(foundPurchasingOrder)
          const broadcast = {
            purchasingOrder: updatedStatusPurchasingOrder.value,
            role: "checker"
          }
          const newBroadcast = await Broadcast.create(broadcast)
          console.log(broadcast)

          
          //create history
          let payloadHis = updatedStatusPurchasingOrder.value
          payloadHis.poId = payloadHis._id
          payloadHis.user = authorize
          delete payloadHis._id
          const createPOHistory = await POHistory.create(payloadHis)
          //end create history

          return newBroadcast.ops[0]
        } catch (err) {
          console.log(err)
          return new ApolloError("bad request", "404", err)
        }
      },

      async createBroadcastPicker(_, args) {
        try {
          const authorize = await authorization(args.access_token, "warehouseadmin")
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }

          const foundStoreReq = await StoreRequest.findById(args.idStoreReq)
          const payload = {
            status: 'picking',
            updatedAt: new Date()
          }
          const updatedStatusStoreReq = await StoreRequest.updateStatus(foundStoreReq._id, payload)
          // console.log(updatedStatusStoreReq)

          const broadcastPayload = {
            role: "picker",
            listItem: args.itemsToPick,
            StoreReq: updatedStatusStoreReq.value
          }
          // console.log(broadcastPayload,'------calon broadcast')
          const newBroadcast = await Broadcast.create(broadcastPayload)
          // console.log(newBroadcast)
          return newBroadcast.ops[0]
        } catch (error) {
          console.log(error)
          return new ApolloError("bad request", "404", error)
        }
      }
      
    }
  }
}