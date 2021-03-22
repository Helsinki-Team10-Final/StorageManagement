const { connect } = require('../config/mongodb')
const server = require('../app')

connect().then(async (db) => {
    console.log('database connected')
    server.listen().then(({ url }) => console.log('Apolo running in url: ', url))
})
