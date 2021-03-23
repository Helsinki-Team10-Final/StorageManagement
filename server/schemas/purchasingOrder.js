const { gql, ApolloError } = require('apollo-server')
const PurchasingOrder = require('../models/purchasingOrder')
const { adminWarehouseAuth, buyerAuth } = require('../helpers/authorize')
const { authorization } = require('../helpers/authorize')
const POHistory = require('../models/pohistories')

module.exports = {
  typeDefs: gql`

    type PurchasingOrder {
      _id: ID!
      vendorName: String!
      items: [ItemPO]
      status: String
      createdAt: Date
      updatedAt: Date
      expiredDate: Date
    }

    type ItemPO {
      name: String
      quantity: Int
      currentQuantity: Int
    }

    input ItemInputCreate {
      name: String
      quantity: Int
    }

    input ItemInputUpdate {
      name: String
      quantity: Int
      currentQuantity: Int
    }

    input CreatePurchasingOrderInput {
      vendorName: String
      expiredDate: Date
      items: [ItemInputCreate]
    }

    input UpdateCurrentQuantityPurchasingOrderInput {
      _id: ID!
      vendorName: String!
      items: [ItemInputUpdate]
      status: String
      createdAt: Date
      updatedAt: Date
      expiredDate: Date
    }

    extend type Query {
      purchasingOrders: [PurchasingOrder]
      purchasingOrderById (id: ID!) : PurchasingOrder
    }

    extend type Mutation {
      createPurchasingOrder(input: CreatePurchasingOrderInput!, access_token: String!) : PurchasingOrder
      updateCurrentQuantityPurchasingOrder(id: ID!, input: UpdateCurrentQuantityPurchasingOrderInput, access_token: String) : PurchasingOrder
    }
  `,
  resolvers: {
    Query: {
      async purchasingOrders() {
        try {
          const allPurchasingOrders = await PurchasingOrder.findAll()
          return allPurchasingOrders
        } catch(err) {
          // console.log(err)
          return new ApolloError(err)
        }
      },
      async purchasingOrderById(_, args) {
        try {
          console.log(args.id, 'ini dari skema')
          const purchasingOrderById = await PurchasingOrder.findById(args.id)
          return purchasingOrderById
        } catch(err) {
          console.log(err)
          return new ApolloError("bad request","404",err)
        }
      }
    },
    Mutation: {
      async createPurchasingOrder(_, args) {
        try {
          //buyer
          const authorize = await authorization(args.access_token, "buyer")
          if (!authorize) throw {type: "CustomError", message: "Not authorize"} //throw err

          let dataInput = {...args.input}
          // console.log(args.input)
          dataInput.status = "process"
          dataInput.createdAt = new Date()
          dataInput.updatedAt = new Date()

          const newPurchasingOrder = await PurchasingOrder.create(dataInput)
          // console.log(newPurchasingOrder.ops[0], 'ini sebelum history')
          //create history
          let payload = {...newPurchasingOrder.ops[0]}
          payload.poId = payload._id
          delete payload._id
          payload.user = authorize
          const createPOHistory = await POHistory.create(payload)
          //end create history
          // console.log(newPurchasingOrder.ops[0], 'ini setelah history')
          return newPurchasingOrder.ops[0]
        } catch(err) {
          // console.log(err)
          return new ApolloError("bad request","404",err)
        }
      }
      
    }
  }
}