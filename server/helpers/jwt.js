const jwt = require('jsonwebtoken')

function generateToken(payload){
    return jwt.sign(payload, "SECRET")
}

function decodedToken(access_token){
    return jwt.verify(access_token, "SECRET")
}
module.exports = {
    generateToken,
    decodedToken
}