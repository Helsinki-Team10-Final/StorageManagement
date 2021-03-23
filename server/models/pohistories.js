const { getDatabase } = require('../config/mongodb')
const mongodb = require('mongodb')

class POHistory {
  static find() {
    return getDatabase().collection('pohistories').find().toArray()
  }

  static findOneById(id) {
    return getDatabase().collection('pohistories').findOne({_id: new mongodb.ObjectID(id)})
  }

//   static findOneByPOId(idPO {
//     return getDatabase().collection('pohistories').findOne({ idPO })
//   }

  static create(obj) {
    return getDatabase().collection('pohistories').insertOne(obj)
  }

}


module.exports = POHistory