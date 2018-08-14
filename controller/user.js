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
    console.log('------_>', params)
    super.validate(User.schema, User.create, params).catch(err => {
      return res.send(err)
    })
    const result = await service.create(params)
    res.json(result)
  }
}

const user = new UserController()
module.exports = user
