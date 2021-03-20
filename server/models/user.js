const { getDatabase } = require('../config/mongodb')
const mongodb = require('mongodb')

class User {
  static find() {
    return getDatabase().collection('users').find().toArray()
  }

  static findOne(obj) {
    return getDatabase().collection('users').findOne(obj)
  }

  static findOneById(id) {
    return getDatabase().collection('users').findOne({_id: new mongodb.ObjectID(id)})
  }

  static create(obj) {
    return getDatabase().collection('users').insertOne(obj)
  }

  static updateOne(id, updateDoc) {
    const filterId = {_id: new mongodb.ObjectID(id)}
    const options = { "returnNewDocument": true };
    const data =  getDatabase().collection('users').findOneAndUpdate(filterId, {$set: updateDoc})
    return getDatabase().collection('users').findOne({_id: new mongodb.ObjectID(id)})

  }

  static deleteOne(id) {
    return getDatabase().collection('users').deleteOne({_id: new mongodb.ObjectID(id)})
  }
}


module.exports = User