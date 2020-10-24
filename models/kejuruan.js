const mongoose = require('mongoose')

const jurusanSchema = mongoose.Schema({
  jurusan: {
    type: String
  }
})

// eslint-disable-next-line no-unused-vars
const kejuruan = module.exports = mongoose.model('kejuruan', jurusanSchema)
