const Joi = require('joi')
const Enjoi = require('enjoi')
const convert = require('joi-to-json-schema')
const Assert = require('assert')

class BaseController {
  validate (schema, model, json, options) {
    const jsonSchema = convert(schema)
    if (model.requestBody) {
      const required = model.requestBody.required
      jsonSchema.required = required
      const reJoi = Enjoi(jsonSchema)
      const result = Joi.validate(json, reJoi)
      return new Promise((resolve, reject) => {
        if (result.error) {
          const err = result.error.details[0].message
          reject(err)
        } else {
          resolve(result)
        }
      })
    }
  }
}

module.exports = BaseController