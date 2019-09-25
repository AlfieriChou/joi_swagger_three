const should = require('should')
const request = require('supertest')
const { describe } = require('mocha')
const { it } = require('mocha')
const app = require('../server')

describe('GET /users', () => {
  it('result should be string!!', () => {
    request(app)
      .get('/v1/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // eslint-disable-next-line no-unused-expressions
        should(response.body).be.a.String
      })
  })
})

describe('POST /users', () => {
  it('success and response.body mast be String!!', () => {
    request(app)
      .post('/v1/users')
      .send({ phone: '13322221111', password: 'hahahahhaha' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // eslint-disable-next-line no-unused-expressions
        should(response.body).be.a.String
      })
  })

  it('"password" is required', () => {
    request(app)
      .post('/v1/users')
      .send({ phone: '13322221111' })
      .set('Accept', 'application/json')
      .expect(422)
      .then((response) => {
        should(response.error.text).match('"password" is required')
      })
  })

  it('"phone" is required', () => {
    request(app)
      .post('/v1/users')
      .send({ password: 'hahahahhaha' })
      .set('Accept', 'application/json')
      .expect(422)
      .then((response) => {
        should(response.error.text).match('"phone" is required')
      })
  })
})
