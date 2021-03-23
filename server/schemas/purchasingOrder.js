const { gql, ApolloError } = require('apollo-server')
const PurchasingOrder = require('../models/purchasingOrder')
const { adminWarehouseAuth, buyerAuth } = require('../helpers/authorize')
const { authorization } = require('../helpers/authorize')


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
      createPurchasingOrder(input: CreatePurchasingOrderInput, access_token: String!) : PurchasingOrder
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
          const purchasingOrderById = await PurchasingOrder.findById(args.id)
          return purchasingOrderById
        } catch(err) {
          // console.log(err)
          return new ApolloError(err)
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
          return newPurchasingOrder.ops[0]
        } catch(err) {
          // console.log(err)
          return new ApolloError("bad request","404",err)
        }
      },
      // add key currentQuantity to Item PO
      async updateCurrentQuantityPurchasingOrder(_, args) {
        try {
          const authorize = await authorization(args.access_token, "checker")
          if (!authorize) throw {type: "CustomError", message: "Not authorize"} //throw err
          const payload = {
            items: args.input.items,
            status: 'clear',
            updatedAt: new Date()
          }
          const updatedPurchasingOrder = await PurchasingOrder.updateCurrentQuantity(args.id, payload)
          console.log(updatedPurchasingOrder)
          return updatedPurchasingOrder.value
        } catch (err) {
          console.log(err)
          return new ApolloError("bad request","404",err)
        }
      }
    }
  }
}