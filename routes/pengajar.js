/* eslint-disable no-inner-declarations */
/* eslint-disable handle-callback-err */
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// Model
const Kejuruan = require('../models/kejuruan')
const Account = require('../models/user_account')
const Presensi = require('../models/presensi')

// Dashboard Pengajar
router.get('/dashboard', notAuthenticated, (req, res) => {
  const user = {
    kelas: req.user.classroom
  }
  Presensi.find(user, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.render('dashboard', {
        users: result
      })
    }
  })
})

// List siswa hadir
router.get('/dashboard/list-hadir', notAuthenticated, (req, res) => {
  const presensi = {
    kelas: req.user.classroom,
    stat: 'Hadir'
  }
  Presensi.find(presensi, (err, users) => {
    if (err) {
      console.log(err)
    } else {
      res.render('list_hadir', {
        users: users
      })
    }
  })
})

// List siswa izin
router.get('/dashboard/list-izin', notAuthenticated, (req, res) => {
  const presensi = {
    kelas: req.user.classroom,
    stat: 'Izin'
  }
  Presensi.find(presensi, (err, users) => {
    if (err) {
      console.log(err)
    } else {
      res.render('list_izin', {
        users: users
      })
    }
  })
})

// List siswa sakit
router.get('/dashboard/list-sakit', notAuthenticated, (req, res) => {
  const presensi = {
    kelas: req.user.classroom,
    stat: 'Sakit'
  }
  Presensi.find(presensi, (err, users) => {
    if (err) {
      console.log(err)
    } else {
      res.render('list_sakit', {
        users: users
      })
    }
  })
})

/* Get Halaman register pengajar */
router.get('/daftar', (req, res) => {
  Kejuruan.find({}, (err, jurusan) => {
    if (err) {
      console.log(err)
    } else {
      res.render('daftar_pengajar', {
        listKejuruan: jurusan
      })
    }
  })
})

/* Handle Pengajar register */
router.post('/daftar', (req, res) => {
  const nama = req.body.nama
  const username = req.body.username
  const email = req.body.email
  const nowa = req.body.nowa
  const alamat = req.body.alamat
  const password = req.body.password
  const jurusan = req.body.classRoom

  req.checkBody('nama', 'Upss nama tidak boleh kosong').notEmpty()
  req.checkBody('username', 'Upss Username harus di isi').notEmpty()
  req.checkBody('email', 'Upss email juga harus di isi').isEmail()
  req.checkBody('nowa', 'Upss nomor WhatsApp harus di isi').notEmpty()
  req.checkBody('alamat', 'Alamat harus di isi').notEmpty()
  req.checkBody('password', 'Upss anda lupa isi passwordnya').notEmpty()
  req.checkBody('classRoom', 'Sepertinya belum lengkap').notEmpty()
  req.checkBody('password2', 'OOW Password tidak sama sob').equals(req.body.password)

  const errors = req.validationErrors()

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
      role_id: 2
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
function notAuthenticated (req, res, next) {
  const data = req.user.role_id
  if (req.isAuthenticated()) {
    // eslint-disable-next-line eqeqeq
    if (data == 2) {
      return next()
    } else {
      res.redirect('/siswa/absen')
    }
  } else {
    res.redirect('/')
  }
}

module.exports = router
