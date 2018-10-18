const fs = require('fs')
const path = require('path')
const _ = require('lodash')
global.Promise = require('bluebird')
const db = require('./index')
const appRoot = require('app-root-path')

let tasks = []
fs.readdirSync(`${appRoot}/migration/operation`).map(file => {
  let migrations = require(path.join(`${appRoot}/migration/operation`, file))(db)
  let funcArray = []
  migrations.map(migration => {
    if (_.isPlainObject && migration.opt === 'create') {
      return funcArray.push(async () => {
        const exists = await db.schema.hasTable(migration.table)
        if (!exists) {
          return db.schema.createTable(migration.table, t => {
            for (let i in migration.column) {
              let columns = migration.column
              if (i === 'id') {
                t[columns[i].type]()
              } else {
                if (columns[i].type === 'float' || columns[i] === 'double' || columns[i].type === 'decimal') {
                  t[columns[i].type](i, columns[i].precision, columns[i].scale).defaultTo(columns[i].default).comment(columns[i].comment)
                } else if (columns[i].type === 'string' || columns[i].type === 'varchar' || columns[i].type === 'char') {
                  t[columns[i].type](i, columns[i].length).defaultTo(columns[i].default).comment(columns[i].comment)
                } else {
                  t[columns[i].type](i).defaultTo(columns[i].default).comment(columns[i].comment)
                }
              }
            }
          })
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'addColumn') {
      return funcArray.push(async () => {
        const exists = await db.schema.hasColumn(migration.table, migration.field)
        if (!exists) {
          return db.schema.table(migration.table, t => {
            let column
            if (migration['content'].type === 'string' || migration['content'].type === 'varchar' || migration['content'].type === 'char') {
              column = t[migration['content'].type](migration.field, migration['content'].length)
            } else if (migration['content'].type === 'float' || migration['content'].type === 'double' || migration['content'].type === 'decimal') {
              column = t[migration['content'].type](migration.field, migration['content'].precision, migration['content'].scale)
            } else {
              column = t[migration['content'].type](migration.field)
            }
            if (migration['content'].default) column.defaultTo(migration['content'].default)
            if (migration['content'].comment) column.comment(migration['content'].comment)
            if (migration['content'].after) column.after(migration['content'].after)
          })
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'dropColumn') {
      return funcArray.push(async () => {
        const exists = await db.schema.hasColumn(migration.table, migration.field)
        if (!exists) {
          return db.schema.table(migration.table, t => t.dropColumn(migration.field))
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'renameColumn') {
      return funcArray.push(async () => {
        const exists = await db.schema.hasColumn(migration.table, migration.from_column)
        if (exists) {
          return db.schema.table(migration.table, t => t.renameColumn(migration.from_column, migration.to_column))
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'renameTable') {
      return funcArray.push(async () => {
        const exists = await db.schema.hasTable(migration.from_table)
        if (exists) {
          return db.schema.renameTable(migration.from_table, migration.to_table)
        }
      })
    }
    if (_.isPlainObject && migration.opt === 'raw') {
      return funcArray.push(async () => {
        return db.schema.raw(migration.sql)
      })
    }
  })
  tasks = _.union(tasks, funcArray)
})

Promise
  .reduce(tasks, (total, task) => Promise.resolve().then(task), 0)
  .then(() => {
    console.log('sync db done!')
    process.exit()
  })
