// const BaseService = require('../common/base_service')

class UserService {
  // eslint-disable-next-line class-methods-use-this
  async index (params) {
    // console.log('-------->', params)
    return 'Hello'
  }

  // eslint-disable-next-line class-methods-use-this
  async create (params) {
    // console.log('-------->', params)
    return 'world'
  }
}

const user = new UserService()
module.exports = user
