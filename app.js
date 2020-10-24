const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const methodOverride = require('method-override')
const expressValidator = require('express-validator')
const passport = require('passport')

const indexRouter = require('./routes/index')
const siswaRouter = require('./routes/siswa')
const pengajarRouter = require('./routes/pengajar')

const app = express()

// Database
const config = require('./config/database')
// Connect Mongoose
const mongoose = require('mongoose')

mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

const db = mongoose.connection
// check connection
db.once('open', () => {
  console.log('Connected to MongoDb')
})

db.once('error', (err) => {
  console.log(err)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(methodOverride('_method'))

// menggunakan session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
)

// menggunakan flash
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
    var root = namespace.shift()
    var formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Password config
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

app.use('/', indexRouter)
app.use('/siswa', siswaRouter)
app.use('/pengajar', pengajarRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
