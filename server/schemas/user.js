const { gql, ApolloError } = require('apollo-server')
const User = require('../models/user')
const {
  hashPassword,
  comparePassword
} = require('../helpers/bcrypt')
const {
  generateToken,
  decodedToken
} = require ('../helpers/jwt')

module.exports = {
  typeDefs: gql`
    type User {
      _id: ID!
      name: String
      role: String
      email: String
    }

    type UserLogin{
      access_token: String
      name: String
      role: String
    }

    input UserLoginInput {
      email: String
      password: String
    }

    input CreateUserInput {
      email: String
      name: String
      password: String!
      role: String
    }

    extend type Query {
      users: [User]
    }
    
    extend type Mutation {
      login(input: UserLoginInput) : UserLogin
      createUser(user: CreateUserInput): User
    }
  `,
  resolvers: {
    Query: {
      users: async () => {
        try {
          const resDB = await User.find()
          // console.log(resDB)
          return resDB
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      }
    },
    Mutation: {
      createUser: async (_, args) => {
        try {
          // await redis.del("users:data")
          let {name, email, password, role} = args.user
          password = hashPassword(password)
          const user = await User.create({name, email, password, role})
          // console.log(user.ops[0])
          return user.ops[0]
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },
      login: async (_, args) => {
        try {
          const {email, password} = args.input
          const res = await User.findOne({email})
          if (!res) throw {type: "CustomError", message: "Email or Password Wrong"}
          const comparedPassword = await comparePassword(password, res.password)
          if (!comparedPassword) throw {type: "CustomError", message: "Email or Password Wrong"}
          const access_token = await generateToken(res)
          // return res
          // console.log(access_token)
          return {access_token, name: res.name, role: res.role}
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError("bad request","404",error)
        }
      }
    }
  }
}