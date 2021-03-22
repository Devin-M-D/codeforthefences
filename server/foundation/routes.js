var path = require('path')
var userRoutes = require('../routes/userRoutes')
var authRoutes = require('../routes/authRoutes')
var blogRoutes = require('../routes/blogRoutes')
var recipeRoutes = require('../routes/recipeRoutes')

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
  // router.get('/', function(req, res){
  //    if(req.session.page_views){
  //       req.session.page_views++;
  //       res.send("You visited this page " + req.session.page_views + " times");
  //    } else {
  //       req.session.page_views = 1;
  //       res.send("Welcome to this page for the first time!");
  //    }
  // });
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

  userRoutes(DI)
  // authRoutes(DI)
  // blogRoutes(DI)
  recipeRoutes(DI)

  DI.express.app.use(router)
}
