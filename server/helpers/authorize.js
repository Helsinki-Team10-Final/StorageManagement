const {decodedToken} = require('../helpers/jwt')

function checkerAuth(access_token){
    if (decodedToken(access_token).role === 'checker') return true
    return false
}

function pickerAuth(access_token){
    if (decodedToken(access_token).role === 'picker') return true
    return false
}

module.exports= {
    checkerAuth,
    pickerAuth
}