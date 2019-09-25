const convert = require('joi-to-json-schema')
const { Validator } = require('jsonschema')

const v = new Validator()

// eslint-disable-next-line consistent-return
const validate = async (schema, model, json, options) => {
  const jsonSchema = convert(schema)
  if (model.requestBody) {
    const { required } = model.requestBody
    jsonSchema.required = required
    const result = await v.validate(json, jsonSchema)
    return new Promise((resolve, reject) => {
      if (result.errors[0]) {
        const err = result.errors[0].message
        reject(err)
      } else {
        resolve(result)
      }
    })
  }
}

class BaseController {
  constructor () {
    this.validate = validate
  }
}

module.exports = BaseController
