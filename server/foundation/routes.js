var path = require('path')
var DI = require('./DICore')
var userRoutes = require('../routes/userRoutes')
var authRoutes = require('../routes/authRoutes')
var blogRoutes = require('../routes/blogRoutes')
var recipeRoutes = require('../routes/recipeRoutes')
var vikingChessRoutes = require('../routes/vikingChessRoutes')

module.exports = async (expressApp, expressApi) => {

  expressApp.use(expressApi.static(__dirname + '/../../client'))
  expressApp.use(expressApi.static(__dirname + '/../../client/assets'))
  var router = expressApi.Router()

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

  userRoutes(router)
  authRoutes(router)
  blogRoutes(router)
  recipeRoutes(router)
  vikingChessRoutes(router)

  expressApp.use(router)
}
