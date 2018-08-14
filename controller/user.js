const User = require('../model/user')
const BaseController = require('../common/base_controller')
const service = require('../service/user')

class UserController extends BaseController {
  async index (req, res) {
    const params = req.query
    const result = await service.index(params)
    res.json(result)
  }
  async create (req, res) {
    const params = req.body
    super.validate(User.schema, User.create, params).then(async() => {
      const result = await service.create(params)
      res.json(result)
    }).catch(err => {
      return res.status(422).send(err)
    })
  }
}

const user = new UserController()
module.exports = user
