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

  static findAllByItemName (name) {
    console.log(name)
    return getDatabase().collection('purchasingorder').find({status: 'clear', items: {$elemMatch: {name: name}}}).toArray()
  }

  static updateStatus(id, payload) {
    return getDatabase().collection('purchasingorder').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {status: payload.status, updatedAt: payload.updatedAt} },
      { returnNewDocument: true , returnOriginal: false }
    )
  }
  
  static updateCurrentQuantity(id, payload) {
    return getDatabase().collection('purchasingorder').findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: {items: payload.items, updatedAt: payload.updatedAt, status: payload.status} },
      { returnNewDocument: true , returnOriginal: false }
    )
  }

}

module.exports = PurchasingOrder