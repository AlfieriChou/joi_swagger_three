const app = require('../server')
const should = require('should')
const request = require('supertest')

describe('GET /users', function() {
  it('result should be string!!', function() {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        response.body.should.be.a.String
      })
  })
})

describe('POST /users', function() {
  it('success and response.body mast be String!!', function() {
    request(app)
      .post('/users')
      .send({phone: '13322221111', password: 'hahahahhaha'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        response.body.should.be.a.String
      })
  })

  it('"password" is required', function() {
    request(app)
      .post('/users')
      .send({phone: '13322221111'})
      .set('Accept', 'application/json')
      .expect(422)
      .then(response => {
        response.error.text.should.match('"password" is required')
      })
  })

  it('"phone" is required', function() {
    request(app)
      .post('/users')
      .send({password: 'hahahahhaha'})
      .set('Accept', 'application/json')
      .expect(422)
      .then(response => {
        response.error.text.should.match('"phone" is required')
      })
  })
})
