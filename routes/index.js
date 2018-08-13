const express = require('express')
const {celebrate} = require('celebrate')
const user = require('../controller/user')
const swagger = require('../controller/swagger')

const api = express.Router()

api.get('/users', user.index.handler)
api.post('/users', user.create.handler)

api.get('/swagger.json', swagger.index.handler)

module.exports = api