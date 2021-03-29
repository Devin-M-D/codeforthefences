var userService = require("../services/userService")
var DI = require('../foundation/DICore')

module.exports = (router) => {
  router.post('/crud/users/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var users = await userService.getAll()
    DI.rh.succeed(res, users)
  }))
}
