var DI = require('../foundation/DICore')
var userService = require("../services/userService")
var authService = require("../services/authService")

module.exports = (expressApp, debugging) => {
  expressApp.use(async(req, res, next) => {
    if (req.originalUrl.indexOf("/js/") == -1
      && req.originalUrl.indexOf("/css/") == -1
      && req.originalUrl.indexOf("/components/") == -1
      && req.originalUrl.indexOf("/pages/") == -1
    ){
      await userSessionInnerware(req, res)
      await debuggingInnerware(req, res, debugging)
    }
    next()
  })
}

async function userSessionInnerware (req, res) {
  var visitorName = "Anonymous"
  var visitorId = "-1"
  if (req.cookies && req.cookies['connect.sid']){
    var sessionUser = await authService.getSession(req.cookies['connect.sid'])
    if (DI.utils.isDef(sessionUser)) {
      if (req.body && req.cookies['userId'] && sessionUser.id != req.cookies['userId']) {
        DI.rh.fail(res, "Invalid session, please login again.")
      }
      visitorName = sessionUser.username
      visitorId = sessionUser.id
    }
  }
  if (req.cookies && (!req.cookies["username"] || !req.cookies["userId"])){
    req.cookies['username'] = visitorName;
    req.cookies['userId'] = visitorId;
    res.cookie('username', visitorName, { maxAge: 900000, httpOnly: true, sameSite: true });
    res.cookie('userId', visitorId, { maxAge: 900000, httpOnly: true, sameSite: true });
  }
}

async function debuggingInnerware (req, res, debugging) {
  if (debugging){
    if (!Object.getOwnPropertyNames(req.body).length == 0) {
      //console.log("Debugging flag added to request by server")
    }
    req.body.debug = true

    var log = `User ${req.cookies["username"]} requested ${req.originalUrl}`
    console.log(log)
  }
}
