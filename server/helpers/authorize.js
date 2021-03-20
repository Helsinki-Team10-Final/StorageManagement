const {decodedToken} = require('../helpers/jwt')

const User = require('../models/user')

async function authorization(access_token, role) {
  const user = decodedToken(access_token)
  const findUser = await User.findOneById(user._id)
  if (!findUser) return false
  if (findUser.role !== role) return false
  return true
}

module.exports= {
  authorization
}
