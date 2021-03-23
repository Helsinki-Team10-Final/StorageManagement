const { gql, ApolloError } = require("apollo-server");
const StorageChild = require("../models/storage_child");
const { authorization } = require("../helpers/authorize");

module.exports = {
  typeDefs: gql`
    # scalar Date

    type StorageChild {
      _id: ID!
      name: String
      item: [reqItem]
      createdAt: Date
      updatedAt: Date
    }

    type reqItem {
      name: String
      quantity: Int
    }

    input inputItem {
      name: String
      quantity: Int
    }

    input CreateStorageChild {
      name: String
      item: [inputItem]
    }

    extend type Query {
      stores: [StorageChild]
    }

    extend type Mutation {
      createStore(store: CreateStorageChild): StorageChild
    }
  `,

  resolvers: {
    Query: {
      stores: async () => {
        try {
          const respone = await StorageChild.findAll();
          return respone;
        } catch (error) {
          console.log(error, "---> error");
          return new ApolloError(error);
        }
      },
    },

    Mutation: {
      createStore: async (_, args) => {
        try {
          const authorize = await authorization(args.access_token, "buyer");
          if (!authorize) throw { type: "CustomError", message: "Not authorize" }; //throw err

          let dataInput = { ...args.store };
          console.log("masuk");
          console.log(args.store);
          dataInput.createdAt = new Date();
          dataInput.updatedAt = new Date();
          const respone = await StorageChild.create(dataInput);
          return respone.ops[0];
        } catch (error) {
          console.log(error, "---> error");
          return new ApolloError(error);
        }
      },
    },
  },
};