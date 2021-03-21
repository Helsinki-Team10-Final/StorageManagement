const { ApolloServer, gql } = require('apollo-server')
const Schemas = require('./schemas/index')
const { connect } = require('./config/mongodb')
const purchasingOrderSchema = require('./schemas/purchasingOrder')
const adminSchema = require('./schemas/admin')
const checkerSchema = require('./schemas/checker')
const itemSchema = require('./schemas/item')
const userSchema = require('./schemas/user')
// const storeSchema = require('./schemas/storage_child')

const customScalarResolver = require('./schemas/graphQlResolver')
const storeRequestSchema = require('./schemas/storeRequest')
const itemSchema = require('./schemas/item')

const server = new ApolloServer({
    typeDefs: [Schemas.typeDefs, purchasingOrderSchema.typeDefs, adminSchema.typeDefs, checkerSchema.typeDefs, itemSchema.typeDefs, userSchema.typeDefs, storeRequestSchema.typeDefs],
    resolvers: [customScalarResolver, Schemas.resolvers, adminSchema.resolvers, purchasingOrderSchema.resolvers, checkerSchema.resolvers, itemSchema.resolvers, userSchema.resolvers, storeRequestSchema.resolvers]
})

connect().then(async (db) => {
    console.log('database connected')
    server.listen().then(({ url }) => console.log('Apolo running in url: ', url))
})

