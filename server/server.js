var DI = require('./serverLogic');
//console.log(DI)

DI.express.app.listen(DI.express.port);
console.log('Magic happens on port ' + DI.express.port);
