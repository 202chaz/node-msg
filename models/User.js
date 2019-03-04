const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true
  }
})
// Adds created/updates at save
UserSchema.plugin(timestamp)

const User = mongoose.model('User', UserSchema)

module.exports = User;
