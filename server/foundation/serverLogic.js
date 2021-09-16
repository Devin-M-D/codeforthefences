var fs = require('fs')
var https = require('https')
var express = require('express')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var cors = require('cors')

function configExpress(port) {
  var expressApp = express()
  //redirect http to https
  expressApp.enable('trust proxy')
  if (port == 80) {
    expressApp.use((req, res, next) => {
      req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
    })
  }
  //serve json and static files (allow dotfiles for certbot SSL)
  expressApp.use(express.json())
  expressApp.use(express.static(__dirname + '/../.well-known/', { dotfiles: 'allow' } ))
  addCors(expressApp)
  addSessions(expressApp)
  return {
    api: express,
    app: expressApp,
    port: port || 8081,
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
  }))
}

function setHTTPS(express) {
  var privateKey = fs.readFileSync('/etc/letsencrypt/live/codeforthefences.com/privkey.pem', 'utf8')
  var certificate = fs.readFileSync('/etc/letsencrypt/live/codeforthefences.com/cert.pem', 'utf8')
  var ca = fs.readFileSync('/etc/letsencrypt/live/codeforthefences.com/chain.pem', 'utf8')

  var credentials = {
  	key: privateKey,
  	cert: certificate,
  	ca: ca
  }
  express.httpsServer = https.createServer(credentials, express.app)
}

var innerware = require('../middleware/innerware')
var routes = require('./routes')
var outerware = require('../middleware/outerware')

module.exports = async (config) => {
  var express = configExpress(config.port)
  if (config.port == 80) { setHTTPS(express) }
  innerware(express.app, config.debug)
  routes(express.app, express.api)
  outerware(express.app, config.debug)
  return express
}
