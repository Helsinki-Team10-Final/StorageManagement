const { gql, ApolloError } = require("apollo-server");
const StorageChild = require("../models/storage_child");

module.exports = {
  typeDefs: gql`
    type StorageChild {
      _id: ID!
      name: String
      item: [String]
    }

    input CreateStorageChild {
      name: String
      item: [String]
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
          let { name } = args.store;
          const store = await StorageChild.create({ name });
          return store.ops[0];
        } catch (error) {
          console.log(error, "---> error");
          return new ApolloError(error);
        }
      },
    },
  },
};