const { gql, ApolloError } = require('apollo-server')

module.exports = {
  typeDefs: gql`
  type Query 
  type Mutation
  `,
  resolvers: {
  }
}
