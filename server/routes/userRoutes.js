var DI = require('../foundation/DICore')
var userService = require("../services/userService")

module.exports = (router) => {
  router.post('/crud/users/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var users = []
    if (req.body.name){ users = await userService.findByName(req.body.name) }
    else { users = await userService.getAll() }
    DI.rh.succeed(res, users)
  }))
}
