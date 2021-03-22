const { getDatabase } = require("../config/mongodb")
const { ObjectId } = require('bson')

class Store{
  static create(data) {
    return getDatabase().collection('stores').insertOne(data)
  }

  static findAll() {
    return getDatabase().collection('stores').find().toArray()
  }

  static findById(id) {
    return getDatabase().collection('stores').findOne({ _id: ObjectId(id) })
  }

}

module.exports = Store