module.exports = (DI, debugging) => {
  //set logging state mostly for using the true false at the end of the conditional for debugging server code locally
  DI.express.app.use(async(req, res, next) => {
    if (debugging){
      if (!Object.getOwnPropertyNames(req.body).length == 0) {
        console.log("Debugging flag added to request by server")
      }
      req.body.debug = true
    }
    next()
  })

  //master every-call logging
  DI.express.app.use(async(req, res, next) => {
    var log = null
    var visitorName = "Anonymous"
    var userSession = DI.utils.findSession(req)
    if (DI.utils.isDef(userSession)) {
      visitorName = userSession.username
    }
    if (Object.getOwnPropertyNames(req.body).length == 0
      || (Object.getOwnPropertyNames(req.body).length == 1 && DI.utils.isDef(req.body.debug)))
    {
      log = `User ${visitorName} requested ${req.originalUrl}`
      console.log(log)
    }
    else if (Object.getOwnPropertyNames(req.body).length > 1 && req.body.debug == true) {
      log = `User ${visitorName} visited ${req.originalUrl} with data: `
      console.log(log)
      console.log(req.body)
    }
    next()
  })
  //
  // //attach user db session to req
  // DI.express.app.use(async(req, res, next) => {
  //   // console.log("Active Server Sessions: ",
  //   //   DI.sessions.map((session) => { return { token: session.token, username: session.username, hasPool: DI.utils.isDef(session.dbPool) } })
  //   // )
  //   if (DI.utils.isDef(req.body.token)){
  //     var userSession = DI.utils.findSession(req)
  //     if (DI.utils.isDef(userSession)) {
  //       req.username = userSession.username
  //       req.dbPool = userSession.dbPool
  //       req.token = userSession.token
  //     }
  //     else {
  //       console.log("Token sent but userSession not found")
  //       res.json({ status: "e", payload: "Unable to locate user session" })
  //       return
  //     }
  //   }
  //   next()
  // })
}
