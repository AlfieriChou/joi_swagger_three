const knex = require('knex')
const path = require('path')

let env = process.argv[2]
if (!env) env = 'default'
const configPath = path.join(__dirname, '../config', `config.${env}.js`)
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const config = require(configPath)
/* eslint-enable global-require */
/* eslint-enable import/no-dynamic-require */

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
