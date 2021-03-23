const { getDatabase } = require("../config/mongodb")
const { ObjectId } = require('bson')

class StoreRequest{
  static create(data) {
    return getDatabase().collection('storerequests').insertOne(data)
  }

  static findAll() {
    return getDatabase().collection('storerequests').find().toArray()
  }

  static findById(id) {
    return getDatabase().collection('storerequests').findOne({ _id: ObjectId(id) })
  }

  static updateStatus(id, payload) {
    return getDatabase().collection('storerequests').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {status: payload.status, updatedAt: payload.updatedAt} },
      { returnNewDocument: true , returnOriginal: false }
    )
  }

  static updateCurrentQuantity(id, payload) {
    return getDatabase().collection('storerequests').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {items: payload} },
      { returnNewDocument: true , returnOriginal: false }
    )
  }

}

module.exports = StoreRequest