const BaseService = require('../common/base_service')

class UserService {
  async index (params) {
    // console.log('-------->', params)
    return 'Hello'
  }
  async create (params) {
    // console.log('-------->', params)
    return 'world'
  }
}

const user = new UserService()
module.exports = user
