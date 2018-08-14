const app = require('../server')
const should = require('should')
const request = require('supertest')

let swagger

describe('GET /swagger.json!!!', function() {
  it('respond with json', function() {
    request(app)
      .get('/swagger.json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        swagger = response.body
      })
  })
})

describe('swagger.json test!!!', function() {
  it('swagger.json openapi mast be 3.0.0!!', function() {
    (swagger.openapi).should.match('3.0.0')
  })
  it('swagger.json paths mast be object!!', function() {
    (swagger.paths).should.be.an.Object
  })
})
