const app = require('../server')
const should = require('should')
const request = require('supertest')

describe('GET /swagger.json!!!', function () {
  it('respond with json', function () {
    request(app)
      .get('/swagger.json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        response.body.should.be.an.Object
      })
  })
})
