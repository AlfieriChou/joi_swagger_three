const knex = require('knex')
const path = require('path')

let env = process.argv[2]
if (!env) env = 'default'
const configPath = path.join(__dirname, '../config', `config.${env}.js`)
// eslint-disable-next-line import/no-dynamic-require,global-require
const config = require(configPath)

const knexConfig = {
  client: 'mysql',
  connection: {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    supportBigNumbers: true,
    charset: 'utf8mb4',
    connectTimeout: 15000
  }
}
const db = knex(knexConfig)

module.exports = db
