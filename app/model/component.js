const Joi = require('joi')

module.exports = {
  pagination: Joi.boolean().description('是否分页 true-是 false-否'),
  page: Joi.number().description('页码'),
  limit: Joi.number().description('条数')
}
