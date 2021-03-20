const { gql, ApolloError } = require('apollo-server')
const User = require('../models/user')
const Item = require('../models/item')
const {
  hashPassword,
  comparePassword
} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const {checkerAuth, pickerAuth} = require('../helpers/authorize')

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
        items: [Item]
        item(itemId: ID!): Item
    }

    type Mutation{
      login(input: UserLoginInput): UserLogin
      createUser(user: CreateUserInput): User
      createItem(item: CreateItemInput): Item
      checkerUpdateItem(id: ID!, quantity: Int, access_token: String): Item
      pickerUpdateItem(id: ID!, quantity: Int, access_token: String): Item
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

      items: async () => {
        try {
          const res = await Item.find()
          // console.log(resDB)
          return res
        } catch (error) {console.log(error, '---> error')
          return new ApolloError(error)
        }
      },

      item: async (parent, args, context, info) => {
        try {
          // console.log(args, '------')
          const res = await Item.findOne(args.itemId)
          // console.log(res)
          return res
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

      checkerUpdateItem: async(_, args) => {
        try {
          // console.log(args,'-------')
          if (!await checkerAuth(args.access_token)) throw {type: "CustomError", message: "Not authorize"}
          let item = await Item.findOne(args.id)
          item.quantity += args.quantity
          let updatedItem = await Item.updateOne(args.id, {quantity: item.quantity})
          return updatedItem
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },

      pickerUpdateItem: async(_, args) => {
        try {
          // console.log(args,'-------')
          if (!await pickerAuth(args.access_token)) throw {type: "CustomError", message: "Not authorize"}
          let item = await Item.findOne(args.id)
          item.quantity -= args.quantity
          let updatedItem = await Item.updateOne(args.id, {quantity: item.quantity})
          return updatedItem
        } catch (error) {
          console.log(error, '---> error')
          return new ApolloError(error)
        }
      },

      login: async (_,args) => {
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
      },

    }
  }
}
