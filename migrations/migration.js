const fs = require('fs')
const path = require('path')
const _ = require('lodash')
global.Promise = require('bluebird')
const appRoot = require('app-root-path')
const db = require('./index')

let tasks = []
fs.readdirSync(`${appRoot}/migration/operation`).forEach((file) => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const migrations = require(path.join(`${appRoot}/migration/operation`, file))(db)
  const funcArray = []
  migrations.forEach((migration) => {
    if (_.isPlainObject && migration.opt === 'create') {
      funcArray.push(async () => {
        const exists = await db.schema.hasTable(migration.table)
        if (!exists) {
          db.schema.createTable(migration.table, (t) => {
            const columns = migration.column
            Object.entries(columns).forEach(([key, value]) => {
              if (key === 'id') {
                t[value.type]()
              } else if (['float', 'double', 'decimal'].includes(value.type)) {
                t[value.type](key, value.precision, value.scale)
                  .defaultTo(value.default).comment(value.comment)
              } else if (['string', 'varchar', 'char'].includes(value.type)) {
                t[value.type](key, value.length)
                  .defaultTo(value.default).comment(value.comment)
              } else {
                t[value.type](key).defaultTo(value.default).comment(value.comment)
              }
            })
          })
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'addColumn') {
      funcArray.push(async () => {
        const exists = await db.schema.hasColumn(migration.table, migration.field)
        if (!exists) {
          db.schema.table(migration.table, (t) => {
            let column
            if (['string', 'varchar', 'char'].includes(migration.content.type)) {
              column = t[migration.content.type](migration.field, migration.content.length)
            } else if (['float', 'double', 'decimal'].includes(migration.content.type)) {
              column = t[migration.content.type](
                migration.field, migration.content.precision, migration.content.scale
              )
            } else {
              column = t[migration.content.type](migration.field)
            }
            if (migration.content.default) column.defaultTo(migration.content.default)
            if (migration.content.comment) column.comment(migration.content.comment)
            if (migration.content.after) column.after(migration.content.after)
          })
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'dropColumn') {
      funcArray.push(async () => {
        const exists = await db.schema.hasColumn(migration.table, migration.field)
        if (!exists) {
          db.schema.table(migration.table, t => t.dropColumn(migration.field))
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'renameColumn') {
      funcArray.push(async () => {
        const exists = await db.schema.hasColumn(migration.table, migration.from_column)
        if (exists) {
          db.schema.table(migration.table, t => t.renameColumn(
            migration.from_column, migration.to_column
          ))
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'renameTable') {
      funcArray.push(async () => {
        const exists = await db.schema.hasTable(migration.from_table)
        if (exists) {
          db.schema.renameTable(migration.from_table, migration.to_table)
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'raw') {
      funcArray.push(async () => db.schema.raw(migration.sql))
    }
  })
  tasks = _.union(tasks, funcArray)
})

Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('sync db done!')
    process.exit()
  })
