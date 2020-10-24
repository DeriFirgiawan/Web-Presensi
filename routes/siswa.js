/* eslint-disable handle-callback-err */
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const moment = require('moment')

// Model
const Kejuruan = require('../models/kejuruan')
const Account = require('../models/user_account')
const Presensi = require('../models/presensi')

// Home page siswa
router.get('/absen', ensureAuthenticated, (req, res) => {
  const formatDateStr = 'DD/MM/YYYY'
  const formatTimeStr = 'HH:mm:ss'
  const date = moment().format(formatDateStr)
  const time = moment().format(formatTimeStr)
  // eslint-disable-next-line eqeqeq
  if (req.user.role_id == 2) {
    res.redirect('/pengajar/dashboard')
  } else {
    res.render('siswa_index', {
      users: req.user,
      dates: date,
      time: time
    })
  }
})

/* GET halaman register. */
router.get('/daftar', (req, res) => {
  Kejuruan.find({}, (err, kejuruan) => {
    if (err) {
      console.log(err)
    } else {
      res.render('register', {
        listJurusan: kejuruan
      })
    }
  })
})

// Proccess Siswa Presensi
router.post('/absen', (req, res) => {
  const formatDateStr = 'DD/MM/YYYY'
  const formatTimeStr = 'HH:mm:ss'
  const date = moment().format(formatDateStr)
  const time = moment().format(formatTimeStr)
  const nama = req.user.nama
  const kelas = req.user.classroom
  const status = req.body.presensi

  const newPresensi = new Presensi({
    nama: nama,
    kelas: kelas,
    stat: status,
    date: date,
    time: time
  })

  newPresensi.save((err) => {
    if (err) {
      console.log(err)
    } else {
      req.flash('message', 'Oke Mantap Anda sudah Absen')
      res.redirect('/siswa/absen')
    }
  })
})

/* Proses Register. */
router.post('/daftar', (req, res) => {
  /* Mengambil seluruh component input di template */
  const nama = req.body.nama
  const username = req.body.username
  const email = req.body.email
  const nowa = req.body.nowa
  const alamat = req.body.alamat
  const password = req.body.password
  const jurusan = req.body.classRoom

  /* Validation jika Input tidak lengkap */
  req.checkBody('nama', 'Upss nama tidak boleh kosong').notEmpty()
  req.checkBody('username', 'Upss Username harus di isi').notEmpty()
  req.checkBody('email', 'Upss email juga harus di isi').isEmail()
  req.checkBody('nowa', 'Upss nomor WhatsApp harus di isi').notEmpty()
  req.checkBody('alamat', 'Alamat harus di isi').notEmpty()
  req.checkBody('password', 'Upss anda lupa isi passwordnya').notEmpty()
  req.checkBody('classRoom', 'Sepertinya belum lengkap').notEmpty()
  req.checkBody('password2', 'OOW Password tidak sama sob').equals(req.body.password)

  /* Handle Error messages */
  const errors = req.validationErrors()

  /* Cek jika input ada yang kosong maka akan dikembalikan kehalaman daftar */
  if (errors) {
    res.redirect('/daftar')
    console.log(errors)
  } else {
    /* Jika field input telah lengkap maka akan mendeklarasikan object Account */
    // eslint-disable-next-line prefer-const
    let newUser = new Account({
      nama: nama,
      username: username,
      email: email,
      nowa: nowa,
      alamat: alamat,
      password: password,
      classroom: jurusan,
      role_id: 3
    })
    /* Lalu password akan di hash agar password tidak asli tidak akan terlihat di database */
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err)
        }
        newUser.password = hash
        /* Setelah selesai di hash maka seluruh data yang di masukan user ke input akan di disimpan ke database */
        newUser.save((err) => {
          if (err) {
            console.log(err)
          } else {
            req.flash('message', 'Silakan Login')
            res.redirect('/')
          }
        })
      })
    })
  }
})

// Access Control
function ensureAuthenticated (req, res, next) {
  const data = req.user.role_id
  if (req.isAuthenticated()) {
    // eslint-disable-next-line eqeqeq
    if (data == 3) {
      return next()
    } else {
      res.redirect('/pengajar/dashboard')
    }
  } else {
    res.redirect('/')
  }
}

module.exports = router
