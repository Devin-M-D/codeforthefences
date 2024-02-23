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
      // req.secure || req.url.indexOf("/.well-known/acme-challenge/") != -1 ? next() : res.redirect('https://' + req.headers.host + req.url)
      req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
    })
  }
  //serve json and static files (allow dotfiles for certbot SSL)
  expressApp.use(express.json())
  // expressApp.use(express.static(__dirname + '/../.well-known', { dotfiles: 'allow' } ))
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
  expressApp.use(cors({
   origin:[process.env.ORIGIN],
   methods:['GET','POST','PUT','PATCH','DELETE'],
   credentials: true
  }))
  expressApp.options('*', cors())
}
function addSessions(expressApp){
  expressApp.use(cookieParser())
  expressApp.use(session({
    secret: "Shh, its a secret!",
  	resave: true,
  	saveUninitialized: true,
    cookie: { sameSite: 'strict' }
  }))
}

function setHTTPS(express) {
  var privateKey = fs.readFileSync('/etc/letsencrypt/live/codeforthefences.com/privkey.pem', 'utf8')
  var certificate = fs.readFileSync('/etc/letsencrypt/live/codeforthefences.com/fullchain.pem', 'utf8')

  var credentials = {
  	key: privateKey,
  	cert: certificate,
  }
  express.httpsServer = https.createServer(credentials, express.app)
}

var innerware = require('../middleware/innerware')
var router = require('./router')
var outerware = require('../middleware/outerware')

module.exports = async (config) => {
  var express = configExpress(config.port)
  if (config.port == 80) { setHTTPS(express) }
  await innerware(express.app, config.debug)
  await router(express.app, express.api)
  await outerware(express.app, config.debug)
  return express
}
