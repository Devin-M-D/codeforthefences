var userService = require("../services/userService")

module.exports = (expressApp, debugging) => {
  //attach user db session to req
  expressApp.use(async(req, res, next) => {
    console.log("cookies", req.cookies)
    if (req.cookies && req.cookies['connect.sid']){
      var sessionUser = await userService.getSession(req.cookies['connect.sid'])
      console.log("sessionUser", sessionUser)
      if (sessionUser) {
        console.log("found session user")
        req.body.session = { userId: sessionUser.id }
      }
    }
    next()
  })

  //set logging state mostly for using the true false at the end of the conditional for debugging server code locally
  expressApp.use(async(req, res, next) => {
    if (debugging){
      if (!Object.getOwnPropertyNames(req.body).length == 0) {
        console.log("Debugging flag added to request by server")
      }
      req.body.debug = true

      if (req.body.session.userId){
        var log = `User ${visitorName} requested ${req.originalUrl}`
        console.log(log)
      }
    }
    next()
  })
}
