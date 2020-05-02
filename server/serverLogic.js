var DI = {
  express: configExpress(),
  bcrypt: require('bcryptjs'),
}

// set up database connection
DI.data = require('./dbLogic')(DI)

//set up routes
let routes = require('./routes')(DI)

function configExpress() {
  var express = require('express')
  var expressApp = express()
  addCors(expressApp)
  addBodyParser(expressApp)
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
function addBodyParser(expressApp) {
  var bodyParser = require('body-parser')
  expressApp.use(bodyParser.urlencoded({ extended: true }))
  expressApp.use(bodyParser.json())
}
module.exports = DI
