const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    minLength: 7,
  },
  passwordHash: String,
  users: {
    type: Array
  }
})

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

roomSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Room', roomSchema)