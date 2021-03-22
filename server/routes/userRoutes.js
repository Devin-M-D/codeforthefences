var userService = require("../services/userService")

module.exports = (DI) => {
  DI.router.post('/crud/users/r/', DI.rh.asyncRoute(async (req, res, next) => {
    var users = await userService.getAll()
    DI.rh.succeed(res, users)
  }))
}
