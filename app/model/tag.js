const Joi = require('joi')
const _ = require('lodash')

const props = {
  id: Joi.number().integer().description('id'),
  tag_name: Joi.string().description('标签名'),
  description: Joi.string().description('标签描述')
}

const schema = Joi.object().keys(props).description('标签信息表')

module.exports = {
  schema,
  index: {
    path: '/tags',
    method: 'get',
    tags: ['tags'],
    summary: '获取标签列表',
    query: _.pick(props, ['tag_name']),
    output: Joi.array().items(props).description('返回列表')
  },
  create: {
    path: '/tags',
    method: 'post',
    tags: ['tags'],
    summary: '创建标签',
    requestBody: {
      body: _.pick(props, ['tag_name', 'description']),
      required: ['tag_name']
    }
  },
  update: {
    path: '/tags/{id}',
    method: 'put',
    tags: ['tags'],
    summary: '更新标签信息',
    params: _.pick(props, ['id']),
    requestBody: {
      body: _.pick(props, ['tag_name', 'description'])
    }
  }
}
