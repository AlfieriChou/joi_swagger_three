const express = require('express')
const user = require('../controller/user')
const swagger = require('../controller/swagger')

const api = express.Router()

api.get('/users', user.index)

api.get('/swagger.json', swagger.doc)

module.exports = api