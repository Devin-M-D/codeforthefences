// DI = {
//   express: {
//     api: null,
//     app: null,
//     port: null,
//     router: null
//   },
//   bcrypt: null,
//   data: {
//     client: null,
//     pool: null,
//     runQuery: null,
//     runCommand: null
//   }
// }

var DI = {
  express: configExpress(),
  bcrypt: require('bcryptjs'),
}
//add middleware
require('./middleware/mwIndex.js')(DI);
//set up routes
let routes = require('./routes')(DI)
// set up database connection
DI.data = require('./dbLogic')(DI)

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
module.exports = DI
