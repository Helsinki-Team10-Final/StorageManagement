const { ApolloServer, gql } = require('apollo-server')
const Schemas = require('./schemas/index')
const { connect } = require('./config/mongodb')


const server = new ApolloServer({
    typeDefs: Schemas.typeDefs,
    resolvers: Schemas.resolvers
})

connect().then(async (db) => {
    console.log('database connected')
    server.listen().then(({ url }) => console.log('Apolo running in url: ', url))
    
})

