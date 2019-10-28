const fs = require('fs')
const path = require('path')
const _ = require('lodash')
global.Promise = require('bluebird')
const db = require('./index')

let tasks = []
fs.readdirSync(path.join('./operation')).forEach((file) => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const migrations = require(path.join(__dirname, file))(db)
  const funcArray = []
  migrations.forEach((migration) => {
    if (_.isPlainObject(migration) && migration.opt === 'drop') {
      funcArray.push(async () => db.schema.dropTable(migration.table))
    }
  })
  tasks = _.union(tasks, migrations)
})

Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('sync db done!')
    process.exit()
  })
