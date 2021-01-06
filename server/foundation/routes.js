var path = require('path')
var recipeRoutes = require('../routes/recipeRoutes')
var authRoutes = require('../routes/authRoutes')

module.exports = async (DI) => {

  DI.express.app.use(DI.express.api.static(__dirname + '/../../client'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../../client/assets'))
  var router = DI.express.api.Router()
  DI.router = router

  //#region main route that serves client html
  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../../client/index.html'))
  })
  //catch all route to redirect all gets to the SPA root index.html
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../client/index.html'))
  })
  //#endregion

  //#region test/playground routes
  router.get('/asyncTest', DI.rh.asyncRoute(async (req, res, next) =>
  {
    res.sendFile(path.join(__dirname + '/../client'))
  }))
  router.post('/asyncTest', DI.rh.asyncRoute(async(req, res, next) => {
      DI.rh.succeed(res, {message: "asyncTest route post succeeded", requestBody: req.body})
    })
  )
  //#endregion

  authRoutes(DI)

  //#region crud routes
    router.post('/crud/users/r/', DI.rh.asyncRoute(async (req, res, next) => {
      var data = await DI.rh.query(req, "SELECT * FROM user")
      DI.rh.succeed(res, data)
    }))
    router.post('/crud/blog/r/', DI.rh.asyncRoute(async (req, res, next) => {
      if (req.body.title){
        var data = await DI.data.rootQuery(`SELECT * FROM blogPost WHERE title = :title`, { title: req.body.title})
      }
      else {
        var data = await DI.data.rootQuery(`SELECT title, date FROM blogPost`)
      }
      DI.rh.succeed(res, data)
    }))
  //#endregion

  recipeRoutes(DI)

  DI.express.app.use(router)
}
