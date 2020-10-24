const mongoose = require('mongoose')

const PresensiSiswaSchema = mongoose.Schema({
  nama: String,
  kelas: String,
  stat: {
    type: String,
    required: true
  },
  date: String,
  time: String
})

// eslint-disable-next-line no-unused-vars
const Presensi = module.exports = mongoose.model('PresensiSiswa', PresensiSiswaSchema)
