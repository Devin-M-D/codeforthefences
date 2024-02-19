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
      visitorName = sessionUser.username
      visitorId = sessionUser.id
    }
  }
  if (!DI.utils.isDef(req.body)) { req.body = {} }
  req.body.session = {
    username: visitorName,
    userId: visitorId
  }
}

async function debuggingInnerware (req, res, debugging) {
  if (debugging){
    if (!Object.getOwnPropertyNames(req.body).length == 0) {
      //console.log("Debugging flag added to request by server")
    }
    req.body.debug = true

    var log = `User ${req.body.session.username} requested ${req.originalUrl}`
    console.log(log)
  }
}
