const BaseService = require('../common/base_service')

class UserService {
  async index (params) {
    console.log('-------->', params)
    return 'Hello'
  }
}

const user = new UserService()
module.exports = user
