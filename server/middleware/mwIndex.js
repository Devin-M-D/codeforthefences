let addMiddleware = (DI) => {
  //#region error handling middleware
  DI.express.app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
  //#endregion

  DI.express.app.use('/', function (req, res, next) {
    if (req.is('application/json')) {
      DI.sessions = [
        {
          token: "123",
          payload: req.body
        }
      ]
    }
    next()
  })

  DI.express.asyncRoute = fn =>(req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

}

module.exports = addMiddleware
