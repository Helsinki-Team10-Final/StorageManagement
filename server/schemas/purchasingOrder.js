const { gql, ApolloError } = require('apollo-server')
const PurchasingOrder = require('../models/purchasingOrder')
const { adminWarehouseAuth, buyerAuth } = require('../helpers/authorize')
const { authorization } = require('../helpers/authorize')


module.exports = {
  typeDefs: gql`

    scalar Date

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

    input ItemInput {
      name: String
      quantity: Int
    }

    input PurchasingOrderInput {
      vendorName: String
      expiredDate: Date
      items: [ItemInput]
    }

    input currentQuantityPO {
      name: String
      quantity: Int
      currentQuantity: Int
    }

    input updatePO {
      vendorName: String
      expiredDate: Date
      items: [ItemInput]
    }

    input CurrentQuantityPurchasingOrderInput {
      item_name: String
      quantity: Int
    }

    extend type Query {
      purchasingOrders: [PurchasingOrder]
      purchasingOrderById (id: ID!) : PurchasingOrder
    }

    extend type Mutation {
      createPurchasingOrder(input: PurchasingOrderInput, access_token: String!) : PurchasingOrder
      updateCurrentQuantityPurchasingOrder(id: ID!, input: CurrentQuantityPurchasingOrderInput, access_token: String) : PurchasingOrder
    }
  `,
  resolvers: {
    Query: {
      async purchasingOrders() {
        try {
          const allPurchasingOrders = await PurchasingOrder.findAll()
          return allPurchasingOrders
        } catch(err) {
          console.log(err)
        }
      },
      async purchasingOrderById(_, args) {
        try {
          const purchasingOrderById = await PurchasingOrder.findById(args.id)
          return purchasingOrderById
        } catch(err) {
          console.log(err)
        }
      }
    },
    Mutation: {
      async createPurchasingOrder(_, args) {
        try {
          //buyer
          const authorize = authorization(args.access_token, "buyer")
          if (!authorize) throw {type: "CustomError", message: "Not authorize"} //throw err

          let dataInput = {...args.input}
          console.log(args.input)
          dataInput.status = "process"
          dataInput.createdAt = new Date()
          dataInput.updatedAt = new Date()

          const newPurchasingOrder = await PurchasingOrder.create(dataInput)
          return newPurchasingOrder.ops[0]
        } catch(err) {
          console.log(err)
          return new ApolloError("bad request","404",err)
        }
      },
      // async updateCurrentQuantityPurchasingOrder(_, args) {
      //   try {
      //     const authorize = authorization(args.access_token, "checker")
      //     if (!authorize) throw {type: "CustomError", message: "Not authorize"} //throw err
      //   } catch (err) {
      //     console.log(err)
      //     return new ApolloError("bad request","404",err)
      //   }
      // }
    }
  }
}