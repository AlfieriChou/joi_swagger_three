const express = require('express')
const user = require('../controller/user')
const swagger = require('../controller/swagger')

const api = express.Router()

api.get('/users', user.index)
api.post('/users', user.create)

api.get('/apidoc/swagger.json', swagger.doc)
api.get('/apidoc', swagger.index)

module.exports = api
