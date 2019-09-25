const express = require('express')
const BodyParser = require('body-parser')
const morgan = require('morgan')
const engines = require('consolidate')
const path = require('path')
const config = require('./config/index')
const router = require('./app/routes/index')

const app = express()

app.use(BodyParser.urlencoded({ extended: true }))
app.use(BodyParser.json())

if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'))
}
if (process.env.NODE_ENV.trim() === 'production') {
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":response-time" ms', {
    stream: config.accessLogStream
  }))
}

app.use(express.static(path.join('./public')))
app.engine('html', engines.mustache)
app.set('view engine', 'html')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/v1/', router)

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${config.port}`)
})

module.exports = app
