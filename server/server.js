var DI = require('./serverLogic')()
DI.then((di) => {
  di.express.app.listen(di.express.port);
  console.log('Magic happens on port ' + di.express.port);
});
