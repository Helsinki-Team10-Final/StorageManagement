const { gql, ApolloError } = require("apollo-server")
const { authorization } = require('../helpers/authorize')
const POHistory = require('../models/pohistories')


module.exports = {
  typeDefs: gql`

  type userData{
    _id: ID!
    name: String
    email: String
    role: String
  }

  type poHistory {
    _id: ID!
    vendorName: String!
    items: [ItemPO]
    status: String
    createdAt: Date
    updatedAt: Date
    expiredDate: Date
    user: userData
    poId: ID!
  }

  extend type Query {
    poHistories: [poHistory]
    poHistoriesByPoId(poId: ID!): [poHistory]
  }

  `,
  resolvers: {
    Query: {
      poHistories: async () => {
        try {
          const histories = await POHistory.find()
          return histories
        } catch (error) {
          // console.log(error, '---> error')
          return new ApolloError(error)
        }
      },
      poHistoriesByPoId: async (_,args) => {
        try {
          // console.log(args)
          const histories = await POHistory.findAllByPoId(args.poId)
          return histories
        } catch (error) {
          // console.log(error, '---> error')
          return new ApolloError(error)
        }
      }
    },
    Mutation: {
    }
  }
}