const { getDatabase } = require("../config/mongodb");
const mongodb = require("mongodb");

class StorageChild {
  static create(obj) {
    return getDatabase().collection("storage_child").insertOne(obj);
  }
  static findAll() {
    return getDatabase().collection("storage_child").find().toArray();
  }
}

module.exports = StorageChild;
