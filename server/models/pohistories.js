const { getDatabase } = require('../config/mongodb')
const mongodb = require('mongodb')

class POHistory {
  static find() {
    return getDatabase().collection('pohistories').find().toArray()
  }

  static findAllByPoId (inputPO) {
    return getDatabase().collection('pohistories').find({poId: new mongodb.ObjectID(inputPO)}, {"sort" : [['updatedAt', 'asc']]}).toArray()
  }

  static create(obj) {
    return getDatabase().collection('pohistories').insertOne(obj)
  }

}


module.exports = POHistory