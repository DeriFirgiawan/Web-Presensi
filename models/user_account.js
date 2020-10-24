const mongoose = require('mongoose')

// User Account Schema
const userAccountSchema = mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  nowa: {
    type: String,
    required: true
  },
  alamat: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  classroom: {
    type: String,
    require: true
  },
  role_id: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

// eslint-disable-next-line no-unused-vars
const UserAccount = module.exports = mongoose.model('UserAccount', userAccountSchema)
