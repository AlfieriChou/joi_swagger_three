const User = require('../model/user')
// const BaseController = require('../index')
const service = require('../service/user')

class UserController {
  async index (req, res) {
    const params = req.query
    const result = await service.index(params)
    res.json(result)
  }
}

const user = new UserController()
module.exports = user
