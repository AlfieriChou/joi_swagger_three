const swagger = require('../common/swagger')

class SwaggerController {
  // eslint-disable-next-line class-methods-use-this
  async doc (req, res) {
    const result = await swagger.generateSwagger(
      {
        title: 'Demo API document',
        version: 'v3',
        description: 'Using swagger3.0 & joi to generate swagger.json',
        contact: {
          name: 'AlfieriChou',
          email: 'alfierichou@gmail.com',
          url: 'https://alfierichou.com'
        },
        license: {
          name: 'MIT',
          url: 'https://github.com/AlfieriChou/joi_swagger_three/blob/master/LICENSE'
        }
      }
    )
    res.json(result)
  }

  // eslint-disable-next-line class-methods-use-this
  async index (req, res) {
    await res.render('index.html', { url: 'swagger.json' })
  }
}

const swaggerdoc = new SwaggerController()
module.exports = swaggerdoc
