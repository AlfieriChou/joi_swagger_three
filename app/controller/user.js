const model = require('../model')
const service = require('../service')
const BaseController = require('../common/base_controller')

class UserController extends BaseController {
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
