const { ApolloServer, gql } = require('apollo-server')
const Schemas = require('./schemas/index')
const StoreSchemas = require("./schemas/storage_child");
const { connect } = require('./config/mongodb')

const typeDefs = gql`
  type Query
  type Mutation
`;

const resolvers = {
  Query: {},
};

const server = new ApolloServer({
  typeDefs: [typeDefs, Schemas.typeDefs, StoreSchemas.typeDefs],
  resolvers: [resolvers, Schemas.resolvers, StoreSchemas.resolvers],
});

connect().then(async (db) => {
    console.log('database connected')
    server.listen().then(({ url }) => console.log('Apolo running in url: ', url))
})

