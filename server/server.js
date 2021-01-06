var debug = false
var DI = require('./foundation/serverLogic')(debug)
if (DI == false) { process.exit() }
else {
  DI.then((di) => {
    di.express.app.listen(di.express.port)
    console.log('Magic happens on port ' + di.express.port)
  })
}
