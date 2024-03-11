var DI = require('../foundation/DICore')
var authService = require("../services/authService")

module.exports = (router) => {
  router.post('/signup', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var newUser = req.body
    try {
      var createdUser = await authService.signup(newUser, req.cookies['connect.sid'])
      DI.rh.succeed(res, createdUser)
    }
    catch (ex) { DI.rh.fail(res, ex) }
  }))
  router.post('/login', DI.rh.asyncRoute(async (req, res, next) =>
  {
    var login = req.body
    var user = await authService.findLogin(login.username, login.password)
    if (user) {
      await authService.setSession(req.cookies['connect.sid'], user.id)
      res.cookie('userId', user.id, { maxAge: 900000, httpOnly: true, sameSite: true });
      user.token = req.cookies['connect.sid']
      DI.rh.succeed(res, user)
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
    else {
      DI.rh.fail(res, "session not found")
    }
  }))
}
