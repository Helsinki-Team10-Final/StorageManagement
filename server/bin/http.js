const { connect } = require('../config/mongodb')
const server = require('../app')

connect().then(async (db) => {
    console.log('database connected')
    server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => console.log('Apolo running in url: ', url))
})
