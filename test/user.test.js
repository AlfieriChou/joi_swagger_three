const app = require('../server')
const should = require('should')
const request = require('supertest')
const describe = require('mocha').describe
const it = require('mocha').it

describe('GET /users', function () {
  it('result should be string!!', function () {
    request(app)
      .get('/v1/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        should(response.body).be.a.String
      })
  })
})

describe('POST /users', function () {
  it('success and response.body mast be String!!', function () {
    request(app)
      .post('/v1/users')
      .send({phone: '13322221111', password: 'hahahahhaha'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        should(response.body).be.a.String
      })
  })

  it('"password" is required', function () {
    request(app)
      .post('/v1/users')
      .send({phone: '13322221111'})
      .set('Accept', 'application/json')
      .expect(422)
      .then(response => {
        should(response.error.text).match('"password" is required')
      })
  })

  it('"phone" is required', function () {
    request(app)
      .post('/v1/users')
      .send({password: 'hahahahhaha'})
      .set('Accept', 'application/json')
      .expect(422)
      .then(response => {
        should(response.error.text).match('"phone" is required')
      })
  })
})
