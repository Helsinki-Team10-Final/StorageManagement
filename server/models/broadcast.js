const { getDatabase } = require('../config/mongodb')
const mongodb = require('mongodb')

class Broadcast {
  static find() {
    return getDatabase().collection('broadcasts').find().toArray()
  }

  static findOne(obj) {
    return getDatabase().collection('broadcasts').findOne(obj)
  }

  static create(obj) {
    return getDatabase().collection('broadcasts').insertOne(obj)
  }

  static updateOne(id, updateDoc) {
    const filterId = {_id: new mongodb.ObjectID(id)}
    const options = { "returnNewDocument": true };
    const data =  getDatabase().collection('broadcasts').findOneAndUpdate(filterId, {$set: updateDoc})
    return getDatabase().collection('broadcasts').findOne({_id: new mongodb.ObjectID(id)})
  }

  static deleteOne(id) {
    return getDatabase().collection('broadcasts').deleteOne({_id: new mongodb.ObjectID(id)})
  }
}


module.exports = Broadcast