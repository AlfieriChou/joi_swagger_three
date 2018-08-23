const fs = require('fs')
const path = require('path')
const rfs = require('rotating-file-stream')
const _ = require('lodash')
const development = require('./config.default')
const production = require('./config.prod')

const env = process.env.NODE_ENV || 'development'
const configs = {
  development: development,
  production: production
}
const defaultConfig = {
  env: env
}
const config = _.merge(defaultConfig, configs[env])

const daily = (new Date()).getFullYear() + '-' + (((new Date()).getMonth() + 1) < 10 ? '0' + ((new Date()).getMonth() + 1) : ((new Date()).getMonth() + 1)) + (new Date()).getDate()
const logDirectory = path.join(__dirname, '../logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
config.accessLogStream = rfs(daily + 'access.log', {
  interval: '1d',
  path: logDirectory
})

module.exports = config
