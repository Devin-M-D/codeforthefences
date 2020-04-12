module.exports = (DI) => {
  DI.express.router = DI.express.api.Router()
  var expressRouter = DI.express.router
  DI.express.app.get('/', function(req, res) {
    // DI.data.dbConn = DI.data.connect(DI.data.dbConn)
    res.json({ message: 'api root route!' })
    // orientServer.disconnect()
  });
  DI.express.app.use('/api', expressRouter)

  expressRouter.route('/ingredients').post(function(req, res){
    var name = req.body.ingredient.name
  })
}
