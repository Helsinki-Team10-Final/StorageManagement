const { gql, ApolloError } = require('apollo-server')

module.exports = {
  typeDefs: gql`
  scalar Date
  
  type Query 
  type Mutation
  `,
  resolvers: {
  }
}
