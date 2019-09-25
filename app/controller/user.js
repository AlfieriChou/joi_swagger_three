const model = require('../model')
const service = require('../service')
const BaseController = require('../common/baseController')

class UserController extends BaseController {
  // eslint-disable-next-line class-methods-use-this
  async index (req, res) {
    const params = req.query
    const result = await service.user.index(params)
    res.json(result)
  }

  async create (req, res) {
    const params = req.body
    try {
      await super.validate(model.user.schema, model.user.create, params)
      const result = await service.user.create(params)
      res.json(result)
    } catch (err) {
      res.status(422).send(err)
    }
  }
}

const user = new UserController()
module.exports = user
