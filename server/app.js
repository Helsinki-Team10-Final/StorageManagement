const { ApolloServer, gql } = require('apollo-server')
const Schemas = require('./schemas/index')
const { connect } = require('./config/mongodb')
const purchasingOrderSchema = require('./schemas/purchasingOrder')
const adminSchema = require('./schemas/admin')
const checkerSchema = require('./schemas/checker')

const customScalarResolver = require('./schemas/graphQlResolver')

const server = new ApolloServer({
    typeDefs: [Schemas.typeDefs, purchasingOrderSchema.typeDefs, adminSchema.typeDefs, checkerSchema.typeDefs],
    resolvers: [customScalarResolver, Schemas.resolvers, adminSchema.resolvers, purchasingOrderSchema.resolvers, checkerSchema.resolvers]
})

connect().then(async (db) => {
    console.log('database connected')
    server.listen().then(({ url }) => console.log('Apolo running in url: ', url))
})

