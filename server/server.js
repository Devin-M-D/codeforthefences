var DI = require('./serverLogic');
DI.express.app.listen(DI.express.port);
console.log('Magic happens on port ' + DI.express.port);
