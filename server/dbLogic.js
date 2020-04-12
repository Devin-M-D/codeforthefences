var OrientDB = require('orientjs');

function orientServer() {
  this.connect = (exportObj) => {
      var server = OrientDB({
       host:       'localhost',
       port:       2424,
       username:   'root',
       password:   'testpass123'
     })
     var db = server.use('testDbName')
     console.log('Using Database:', db.name);
     return db;
  }
  this.disconnect = () => {
    // server.close()
    // console.log("OrientDb stopped");
  }
  this.api = require('orientjs')
  this.server = "server placeholder"
  this.dbConn = "db placeholder"
}
var retVal = new orientServer()
module.exports = retVal;
