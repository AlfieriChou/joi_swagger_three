const swagger = require('../common/swagger')

class SwaggerController {
  async doc (req, res) {
    const result = await swagger.generateSwagger()
    res.json(result)
  }
}

const swaggerdoc = new SwaggerController()
module.exports = swaggerdoc