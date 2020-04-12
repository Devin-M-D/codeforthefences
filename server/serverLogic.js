var DI = {
  express: configExpress(),
  bcrypt: addBCrypt(),
  data: require('./dbLogic')
}
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
function addBCrypt(){
  return require('bcryptjs')
}

function configRoutes(){
  var configRoutes = require('./routes')
  configRoutes(DI)
}
configRoutes()
module.exports = DI
