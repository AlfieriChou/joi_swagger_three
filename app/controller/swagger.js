const common = require('../common')
const generateSwagger = common.generateSwagger

class SwaggerController {
  async doc (req, res) {
    const result = await generateSwagger()
    res.json(result)
  }
  async index (req, res) {
    await res.render('index.html', {url: 'swagger.json'})
  }
}

const swaggerdoc = new SwaggerController()
module.exports = swaggerdoc
