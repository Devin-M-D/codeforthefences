var express = require('express')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var cors = require('cors')

function configExpress() {
  var expressApp = express()
  expressApp.use(express.json())
  addCors(expressApp)
  addSessions(expressApp)
  return {
    api: express,
    app: expressApp,
    port: process.env.PORT || 8081,
    router: null
  }
}
function addCors(expressApp){
  expressApp.use(cors())
  expressApp.options('*', cors())
}
function addSessions(expressApp){
  expressApp.use(cookieParser())
  expressApp.use(session({
    secret: "Shh, its a secret!",
  	resave: true,
  	saveUninitialized: true
  }));
}

module.exports = async (debugging) => {
  var DI = {
    express: configExpress(),
    //used by orientdb to query with the db user as query executor
    //sessions: []
  }
  //add helper functions
  require('./diUtilFuncs')(DI)
  //add middleware
  require('../middleware/innerware')(DI, debugging)
  //set up routes
  require('./routes')(DI)
  // set up database connection
  var dbSetUp = await require('./dbLogics/dbLogicNeo4j')
  if (!dbSetUp) { return false }
  return DI
}
