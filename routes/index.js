/* eslint-disable handle-callback-err */
const express = require('express')
const router = express.Router()
const passport = require('passport')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index')
})

// Login Process
router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/siswa/absen',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'Anda Berhasil Keluar')
  res.redirect('/')
})

module.exports = router
