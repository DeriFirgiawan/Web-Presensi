// eslint-disable-next-line no-unused-vars
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user_account')
const bcrypt = require('bcryptjs')

module.exports = (passport) => {
  // Local Strategy
  passport.use(new LocalStrategy((username, password, done) => {
    const query = { username: username }
    User.findOne(query, (err, user) => {
      if (err) throw err

      if (!user) {
        return done(null, false, { message: 'User tidak ditemukan' })
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err

        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password Salah' })
        }
      })
    })
  }))
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
}
