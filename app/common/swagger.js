const Joi = require('joi')
const convert = require('joi-to-json-schema')
const _ = require('lodash')
const appRoot = require('app-root-path')
const dir = require('dir_filenames')
const path = require('path')

const generateSwagger = (info) => {
  const items = dir(`${appRoot}/app/model`)
  _.remove(items, n => n === `${appRoot}/app/model/index.js`)
  _.remove(items, n => n === `${appRoot}/app/model/component.js`)
  const methods = []
  const components = {}
  components.schemas = {}
  items.forEach((item) => {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const model = require(item)
    /* eslint-enable global-require */
    /* eslint-enable import/no-dynamic-require */
    const fileName = path.parse(item).base.replace(/\.\w+$/, '')
    const schemaName = fileName.slice(0, 1).toUpperCase() + fileName.slice(1)
    Object.entries(model).forEach(([key, value]) => {
      if (key === 'schema') {
        const modelSchema = convert(value)
        const schema = {}
        schema[schemaName] = {
          type: 'object',
          properties: modelSchema.properties
        }
        components.schemas = _.merge(components.schemas, schema)
      } else {
        const content = {
          tags: value.tags,
          summary: value.summary,
          description: value.description
        }

        if (value.query) {
          content.parameters = []
          const params = convert(Joi.object(value.query))
          Object.entries(params.properties).forEach(([prop, v]) => {
            content.parameters.push({
              name: prop,
              in: 'query',
              description: v.description,
              schema: {
                type: v.type
              },
              required: false
            })
          })
        }

        if (value.params) {
          content.parameters = []
          const params = convert(Joi.object(value.params))
          Object.entries(params.properties).forEach(([prop, v]) => {
            content.parameters.push({
              name: prop,
              in: 'path',
              description: v.description,
              schema: {
                type: v.type
              },
              required: true
            })
          })
        }

        // if (value.headers) {
        //   content.parameters = []
        //   let params = convert(Joi.object(value.headers))
        //   for (let prop in params.properties) {
        //     let field = {}
        //     field.name = prop
        //     field.in = 'header'
        //     field.description = params.properties[prop].description
        //     field.items = {
        //       'type': params.properties[prop].type
        //     }
        //     field.required = true
        //     content.parameters.push(field)
        //   }
        // }

        if (value.requestBody) {
          const params = convert(Joi.object(value.requestBody.body))
          const request = {}
          request.requestBody = {}
          const bodySchema = request.requestBody
          bodySchema.required = true
          bodySchema.content = {
            'application/json': {
              schema: {
                type: params.type,
                properties: params.properties,
                required: value.requestBody.required
              }
            }
          }
          content.requestBody = request.requestBody
        }

        if (value.output) {
          const outputTemp = {}
          const resp = {}
          Object.entries(value.output).forEach(([k, v]) => {
            resp[k] = {
              description: 'response',
              content: {
                'application/json': {
                  schema: {
                    type: convert(v).type,
                    properties: convert(v).properties
                  }
                }
              }
            }
            _.merge(outputTemp, resp)
          })
          content.responses = outputTemp
        } else {
          content.responses = {
            200: {
              description: 'response success',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${schemaName}` }
                }
              }
            }
          }
        }

        const swaggerMethod = {}
        swaggerMethod[(value.method).toString()] = content

        const swaggerItem = {}
        swaggerItem[(value.path).toString()] = swaggerMethod
        methods.push(swaggerItem)
      }
    })
  })

  let mergeMethod = {}
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < methods.length; ++i) {
    mergeMethod = _.merge(mergeMethod, methods[i])
  }

  const swagger = {}
  swagger.openapi = '3.0.0'
  swagger.info = info
  swagger.paths = mergeMethod
  swagger.components = components
  return swagger
}

module.exports = {
  generateSwagger
}
