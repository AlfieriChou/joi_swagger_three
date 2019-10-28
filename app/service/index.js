const path = require('path')
const fs = require('fs')
const appRoot = require('app-root-path')

const dir = path.resolve(`${appRoot}/app/service/`)
fs.readdirSync(dir).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const name = file.replace('.js', '')
    // eslint-disable-next-line import/no-dynamic-require,global-require
    exports[name] = require(`./${file}`)
  }
})
