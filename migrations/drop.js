const fs = require('fs')
const path = require('path')
const _ = require('lodash')
global.Promise = require('bluebird')
const db = require('./index')

let tasks = []
fs.readdirSync(path.join('./operation')).map(file => {
  let migrations = require(path.join(__dirname, file))(db)
  let funcArray = []
  migrations.map(migration => {
    if (_.isPlainObject(migration) && migration.opt === 'drop') {
      return funcArray.push(async () => {
        return db.schema.dropTable(migration.table)
      })
    }
  })
  tasks = _.union(tasks, migrations)
})

Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    console.log('sync db done!')
    process.exit()
  })
