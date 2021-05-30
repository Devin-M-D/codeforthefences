var db = require('./foundation/dbLogic')
var SQLgraph = require('./foundation/SQLgraph')(db)

var run = async () => {
  //console.log(await db.runQuery("SELECT * FROM ingredient"))
  console.log(await SQLgraph.read("quantity").send())
}

run()
