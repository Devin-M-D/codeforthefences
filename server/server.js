var config = require("./config/config")

async function run() {
  var app = await require('./foundation/serverLogic')(config.debug)
  if (app == false) { process.exit() }
  else {
    app.listen(config.port)
    console.log('Magic happens on port ' + config.port)
  }
}

run()
