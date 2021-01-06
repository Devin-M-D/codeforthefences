function configExpress() {
  var express = require('express')
  var expressApp = express()
  expressApp.use(express.json())
  addCors(expressApp)
  return {
    api: express,
    app: expressApp,
    port: process.env.PORT || 8081,
    router: null
  }
}
function addCors(expressApp){
  var cors = require('cors')
  expressApp.use(cors())
  expressApp.options('*', cors())
}

module.exports = async (debugging) => {
  var DI = {
    express: configExpress(),
    sessions: []
  }
  //add helper functions
  require('./diUtilFuncs')(DI)
  //add middleware
  require('../middleware/innerware')(DI, debugging)
  //set up routes
  require('./routes')(DI)
  // set up database connection
  var dbSetUp = await require('./dbLogic')(DI)
  if (!dbSetUp) { return false }
  return DI
}
