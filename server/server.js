var config = require("./config/config")

async function run() {
  var express = await require('./foundation/serverLogic')(config)
  if (express.app == false) { process.exit() }
  else {
    //http server
    express.app.listen(config.port)
    console.log('Magic happens on port ' + config.port)
    //https server
    if (config.port == 80) {
      express.httpsServer.listen(443, () => {
      	console.log('HTTPS Server running on port 443')
      })
    }
  }
}

run()
