const { ApolloServer, gql } = require('apollo-server')
const Schemas = require('./schemas/index')
const purchasingOrderSchema = require('./schemas/purchasingOrder')
const adminSchema = require('./schemas/admin')
const checkerSchema = require('./schemas/checker')
const itemSchema = require('./schemas/item')
const userSchema = require('./schemas/user')
const pickerSchema = require('./schemas/picker')
// const storeSchema = require('./schemas/storage_child')
const poHistoriesSchema = require('./schemas/pohistories')
const customScalarResolver = require('./schemas/graphQlResolver')
const storeRequestSchema = require('./schemas/storeRequest')


const server = new ApolloServer({
    typeDefs: [Schemas.typeDefs, purchasingOrderSchema.typeDefs, storeRequestSchema.typeDefs, adminSchema.typeDefs, checkerSchema.typeDefs, itemSchema.typeDefs, userSchema.typeDefs, pickerSchema.typeDefs, poHistoriesSchema.typeDefs],
    resolvers: [customScalarResolver, Schemas.resolvers, storeRequestSchema.resolvers, adminSchema.resolvers, purchasingOrderSchema.resolvers, checkerSchema.resolvers, itemSchema.resolvers, userSchema.resolvers, pickerSchema.resolvers, poHistoriesSchema.resolvers]
})

module.exports = server
