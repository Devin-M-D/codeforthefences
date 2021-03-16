var debug = false
var DIstrapper = require('./foundation/serverLogic')(debug)
if (DIstrapper == false) { process.exit() }
else {
  DIstrapper.then((DI) => {
    DI.express.app.listen(DI.express.port)
    console.log('Magic happens on port ' + DI.express.port)
  })
}
