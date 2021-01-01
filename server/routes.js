var path = require('path')
const { v4: uuidv4 } = require('uuid');
// var nodemailer = require('nodemailer')
var utils = require('./index')
var recipeService = require('./services/recipe')

module.exports = async (DI) => {

  DI.express.app.use(DI.express.api.static(__dirname + '/../client'))
  DI.express.app.use(DI.express.api.static(__dirname + '/../client/assets'))
  var router = DI.express.api.Router()

  //#region helper functions (asyncRoute, query, command)
  function asyncRoute (callback) {
    return function (req, res, next) {
      callback(req, res, next).catch(next)
    }
  }
  function transformExpectMany(req, data){
    if (!DI.utils.isDef(req.body.expectMany) && data.length == 1) { return data[0] }
    else return data
  }
  async function query(req, osql, params = null) {
    if (!DI.utils.isDef(req.dbPool)) { return false }
    var data = await DI.data.runQuery(req.dbPool, osql, params)
    return transformExpectMany(req, data)
  }
  async function command(req, osql, params = null) {
    if (!DI.utils.isDef(req.dbPool)) { return false }
    var data = await DI.data.runCommand(req.dbPool, osql, params)
    return transformExpectMany(req, data)
  }
  async function batch(req, osql, params = null) {
    if (!DI.utils.isDef(req.dbPool)) { return false }
    var query = `BEGIN; ${osql} COMMIT;`
    if (osql.indexOf("$res") != -1) { query += `RETURN $res;` }
    var data = await DI.data.runBatch(req.dbPool, query, params)
    return transformExpectMany(req, data)
  }
  async function succeed(res, payload){
    res.json({ status: "s", payload: payload })
  }
  async function fail(res, payload){
    res.json({ status: "e", payload: payload })
  }
  //#endregion

  //#region main route that serves client html
  router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../client/index.html'))
  })
  //catch all route to redirect all gets to the SPA root index.html
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/index.html'))
  })
  //#endregion

  //#region test/playground routes
  router.get('/asyncTest', asyncRoute(async (req, res, next) =>
  {
    res.sendFile(path.join(__dirname + '/../client'))
  }))
  router.post('/asyncTest', asyncRoute(async(req, res, next) => {
      succeed(res, {message: "asyncTest route post succeeded", requestBody: req.body})
    })
  )
  //#endregion

  //#region account routes
  router.post('/signup', asyncRoute(async (req, res, next) =>
  {
    var newUser = req.body
    var existingUser = await DI.data.rootQuery(`SELECT FROM user WHERE username = :username`, { username: newUser.username})
    if (existingUser == null || existingUser.length == 0){
      await DI.data.rootCommand(`CREATE USER ${newUser.username} IDENTIFIED BY ${newUser.password} ROLE admin`, {})
        .then((data) => { succeed(res, data) })
    }
    else { fail(res, "Unable to create new user, username is taken.") }
    succeed(res, data)
  }))
  router.post('/login', asyncRoute(async (req, res, next) =>
  {
    let login = req.body
    var dbPool = await DI.data.startPool(login.username, login.password)
    var newSess = { token: uuidv4(), username: login.username, dbPool: dbPool }
    DI.sessions.push(newSess)
    succeed(res, newSess.token)
  }))
  router.post('/logout', asyncRoute(async (req, res, next) =>
  {
    var userSession = DI.utils.findSession(req)
    if (!DI.utils.isDef(userSession)){
      fail(res, "Couldn't locate user session to log out")
    }
    DI.sessions = DI.sessions.map((x) => {
      if (x){
        if (x.token != userSession.token) { return x }
      }
    })
    succeed(res, "User logged out")
  }))
  router.post('/user/testToken', asyncRoute(async (req, res, next) =>
  {
    await succeed(res, "landed on /user/testToken")
  }))
  //#endregion

  //#region crud routes
    router.post('/crud/users/r/', asyncRoute(async (req, res, next) => {
      var data = await query(req, "SELECT * FROM user")
      succeed(res, data)
    }))
    router.post('/crud/recipe/r/', asyncRoute(async (req, res, next) => {
      var data = await DI.data.rootQuery(recipeService.getAllRecipes.query)
      succeed(res, data)
    }))
    router.post('/crud/recipe/u/', asyncRoute(async (req, res, next) => {
      if (req.body.recipe){
        console.log(req.body.recipe)
      }
      succeed(res, "reached /crud/recipe/u/")
    }))
    router.post('/crud/UoM/r/', asyncRoute(async (req, res, next) => {
      if (req.body.name){
        var data = await DI.data.rootQuery(`SELECT * FROM UoM WHERE name LIKE '%' + :name + '%'`, { name: req.body.name})
      }
      else {
        var data = await DI.data.rootQuery(`SELECT * FROM UoM`)
      }
      succeed(res, data)
    }))
    router.post('/crud/foodType/r/', asyncRoute(async (req, res, next) => {
      if (req.body.name){
        var data = await DI.data.rootQuery(`SELECT * FROM foodType WHERE name LIKE '%' + :name + '%'`, { name: req.body.name})
      }
      else {
        var data = await DI.data.rootQuery("SELECT * FROM foodType")
      }
      succeed(res, data)
    }))
    router.post('/crud/blog/r/', asyncRoute(async (req, res, next) => {
      if (req.body.title){
        var data = await DI.data.rootQuery(`SELECT * FROM blogPost WHERE title = :title`, { title: req.body.title})
      }
      else {
        var data = await DI.data.rootQuery(`SELECT title, date FROM blogPost`)
      }
      succeed(res, data)
    }))
  //#endregion

  DI.express.app.use(router)
}
