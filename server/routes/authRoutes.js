var DI = require('../foundation/DICore')
var userService = require("../services/userService")
var authService = require("../services/authService")

module.exports = (router) => {
  router.post('/signup', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var newUser = req.body
    var existingUser = await userService.findByName(newUser.username)
    console.log(existingUser)
    if (existingUser.length == 0){
      var createdUser = await authService.signup(newUser.username, newUser.password, req.cookies['connect.sid'])
      DI.rh.succeed(res, createdUser)
    }
    else if (existingUser.length > 0) { DI.rh.fail(res, "Unable to create new user, username is taken.") }
    else {
      DI.rh.fail(res, "Unable to create user, reason unknown.")
    }
  }))
  router.post('/login', DI.rh.asyncRoute(async (req, res, next) =>
  {
    let login = req.body
    var user = await userService.findByLogin(login.username, login.password)
    if (user.id) {
      await userService.setSession(req.cookies['connect.sid'], user.id)
      DI.rh.succeed(res, req.cookies['connect.sid'])
    }
    else {
      DI.rh.fail(res, "Incorrect username or password")
    }
  }))
  router.post('/logout', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var user = await authService.logout(req.cookies['connect.sid'])
    if (user.length == 0){
      DI.rh.fail(res, "Couldn't locate user session to log out")
    }
    else {
      DI.rh.succeed(res, "User logged out")
    }
  }))
  router.post('/user/testToken', DI.rh.asyncRoute(async (req, res, next) =>
  {
    DI.rh.succeed(res, "landed on /user/testToken")
  }))
}
