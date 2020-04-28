var OrientDB = require('orientjs');

function orientServer(dbName) {
  this.connect = (DI_data) => {
      var server = OrientDB({
       host:       'localhost',
       port:       2424,
       username:   'root',
       password:   'testpass123'
     })
     DI_data.server = server
     DI_data.dbConn = server.use(dbName)
     console.log('Using Database:', DI_data.dbConn.name);
  }
  this.disconnect = () => {
    // server.close()
    // console.log("OrientDb stopped");
  }
  this.api = OrientDB
  this.server = "server placeholder"
  this.dbConn = "db placeholder"
}
var retVal = new orientServer('testDb')
module.exports = retVal;
