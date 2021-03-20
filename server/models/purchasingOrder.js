const { getDatabase } = require("../config/mongodb")
const { ObjectId } = require('bson')

class PurchasingOrder{
  static create(data) {
    return getDatabase().collection('purchasingorder').insertOne(data)
  }

  static findAll() {
    return getDatabase().collection('purchasingorder').find().toArray()
  }

  static findById(id) {
    return getDatabase().collection('purchasingorder').findOne({ _id: ObjectId(id) })
  }

  static updateStatusFromAdmin(id, payload) {
    return getDatabase().collection('purchasingorder').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {status: payload} },
      { returnNewDocument: true , returnOriginal: false }
    )
  }

  static updateCurrentQuantity(id, payload) {
    return getDatabase().collection('purchasingorder').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {items: payload} },
      { returnNewDocument: true , returnOriginal: false }
    )
  }

}

module.exports = PurchasingOrder