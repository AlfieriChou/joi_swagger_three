const express = require('express')
const BodyParser = require('body-parser')
const celebrate = require('celebrate')
const router = require('./routes/index')
const morgan = require('morgan')
const engines = require('consolidate')
const path = require('path')
const fs = require('fs')
const rfs = require('rotating-file-stream')

const app = express()
const port = process.env.PORT || 4000

app.use(BodyParser.urlencoded({extended: true}))
app.use(BodyParser.json())

const daily = (new Date()).getFullYear() + '-' + (((new Date()).getMonth() + 1) < 10 ? '0' + ((new Date()).getMonth() + 1) : ((new Date()).getMonth() + 1)) + (new Date()).getDate()
const logDirectory = path.join(__dirname, 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
const accessLogStream = rfs(daily + 'access.log', {
  interval: '1d',
  path: logDirectory
})
app.use(morgan('dev'))
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":response-time" ms', {
  stream: accessLogStream
}))

app.use(express.static(__dirname + '/public'))
app.engine('html', engines.mustache)
app.set('view engine', 'html')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/', router)
app.use(celebrate.errors())

app.listen(port)
console.log(`listening on port ${port}`)

module.exports = app
