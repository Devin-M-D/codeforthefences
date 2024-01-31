var DI = require('../foundation/DICore')
var userService = require("../services/userService")
var authService = require("../services/authService")

module.exports = (router) => {
  router.post('/signup', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var newUser = req.body
    var existingUser = await userService.findByName(newUser.username)
    if (existingUser.id) {
      DI.rh.fail(res, "Unable to create new user, username is taken.")
    }
    else {
      var createdUser = await authService.signup(newUser.username, newUser.password, req.cookies['connect.sid'])
      DI.rh.succeed(res, createdUser)
    }
  }))
  router.post('/login', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var login = req.body
    var user = await authService.findLogin(login.username, login.password)
    if (user) {
      await authService.setSession(req.cookies['connect.sid'], user.id)
      DI.rh.succeed(res, req.cookies['connect.sid'])
    }
    else {
      DI.rh.fail(res, "Incorrect username or password")
    }
  }))
  router.post('/logout', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var user = await authService.logout(req.cookies['connect.sid'])
    if (user.affectedRows == 0){
      DI.rh.fail(res, "Couldn't locate user session to log out")
    }
    else {
      DI.rh.succeed(res, "User logged out")
    }
  }))
  router.post('/user/testToken', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var user = await authService.getSession(req.cookies['connect.sid'])
    if (DI.utils.isDef(user)){
      DI.rh.succeed(res, "landed on /user/testToken")
    }
    DI.rh.fail(res, "session not found")
  }))
}
