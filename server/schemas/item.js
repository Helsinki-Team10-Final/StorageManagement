const { gql, ApolloError } = require('apollo-server')
const Item = require('../models/item')
const {checkerAuth, pickerAuth} = require('../helpers/authorize')

module.exports = {
  typeDefs: gql`
    type Item {
      _id: ID!
      name: String
      quantity: Int
    }

    input CreateItemInput {
      name: String
    }

    extend type Query {
      items: [Item]
      item(itemId: ID!): Item
    }

    extend type Mutation{
      createItem(item: CreateItemInput): Item
      deleteItem(id: ID!): Item
    }
  `,
  resolvers: {
    Query: {
      items: async () => {
        try {
          const res = await Item.find()
          // console.log(resDB)
          return res
        } catch (error) {console.log(error, '---> error')
          return new ApolloError(error)
        }
      },

      item: async (_, args) => {
        try {
          // console.log(args, '------')
          const res = await Item.findOne(args.itemId)
          // console.log(res)
          return res
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      }
    },
    Mutation: {
      createItem: async (_, args) => {
        try {
          // await redis.del("items:data")
          let {name} = args.item
          const quantity = 0
          const item = await Item.create({name, quantity})
          // console.log(item.ops[0])
          return item.ops[0]
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },
      
    }
  }
}
