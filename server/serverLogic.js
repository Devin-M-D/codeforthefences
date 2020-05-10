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

module.exports = async () => {
  var DI = {
    express: configExpress(),
    bcrypt: require('bcryptjs'),
  }
  //add middleware
  require('./middleware/mwIndex.js')(DI);
  //set up routes
  require('./routes')(DI)
  // set up database connection
  await require('./dbLogic')(DI)
  return DI
}
