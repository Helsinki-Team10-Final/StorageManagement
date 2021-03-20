const { getDatabase } = require('../config/mongodb')
const mongodb = require('mongodb')

class Item {
  static find() {
    return getDatabase().collection('items').find().toArray()
  }

  static findOne(id) {
    return getDatabase().collection('items').findOne({_id: new mongodb.ObjectID(id)})
  }

  static create(obj) {
    return getDatabase().collection('items').insertOne(obj)
  }

  static updateOne(id, updateDoc) {
    const filterId = {_id: new mongodb.ObjectID(id)}
    const options = { "returnNewDocument": true };
    const data =  getDatabase().collection('items').findOneAndUpdate(filterId, {$set: updateDoc})
    return getDatabase().collection('items').findOne({_id: new mongodb.ObjectID(id)})

  }

  static deleteOne(id) {
    return getDatabase().collection('items').deleteOne({_id: new mongodb.ObjectID(id)})
  }
}


module.exports = Item