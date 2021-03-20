const { gql, ApolloError } = require('apollo-server')
const User = require('../models/user')
const Item = require('../models/item')
const {
  hashPassword,
  comparePassword
} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')

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
    }

    type Item{
      _id: ID!
      name: String
      quantity: Int
    }

    input UserLoginInput {
      email: String
      password: String
    }

    input CreateUserInput {
      email: String
      name: String
      password: String
      role: String
    }

    input CreateItemInput {
      name: String
    }

    type Query {
        users: [User]
        login(input: UserLoginInput): UserLogin
        items: [Item]
        item(itemId: ID!): Item
    }

    type Mutation{
      createUser(user: CreateUserInput): User
      createItem(item: CreateItemInput): Item
      checkerUpdateItem(id: ID!, quantity: Int): Item
      pickerUpdateItem(id: ID!, quantity: Int): Item
      deleteItem(id: ID!): Item
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
      },

      login: async (parent, args, context, info) => {
        try {
          const {email, password} = args.input
          const res = await User.findOne({email})
          if (!res) throw {type: "CustomError", message: "Email or Password Wrong"}
          const comparedPassword = await comparePassword(password, res.password)
          if (!comparedPassword) throw {type: "CustomError", message: "Email or Password Wrong"}
          const access_token = await generateToken(res)
          // return res
          // console.log(access_token)
          return {access_token}
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError("bad request","404",err)
        }
      },

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

      createItem: async (_, args) => {
        try {
          // await redis.del("items:data")
          let {name} = args.item
          const quantity = 0
          const item = await Item.create({name, quantity})
          // console.log(item.ops[0])
          return item.ops[0]
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },


    }
  }
}
