var mysql = require("mysql2/promise")

var dbLogic = {
  pool: mysql.createPool({
    host: 'localhost',
    user: 'root',
  	password : 'password',
    database: 'codeforthefences',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true
  })
}

dbLogic.runQuery = async (query, params = null, expectOne = 0, debug = 0) => {

  var result, fields
  try {
    [result, fields] = await dbLogic.pool.query(query, params);
  } catch (err) {
    console.log("SQL ERROR:", err);
  }
  // console.log(result);

  if (result.constructor.name == "OkPacket"){
    return result.insertId
  }
  result = JSON.parse(JSON.stringify(result))
  if (debug){
    console.log("{")
    console.log("  running query:", query)
    console.log("  with params:", params)
    console.log("  query result:", result)
    console.log("}")
  }
  if (expectOne){
    if (result.length == 0) { return null }
    if (result.length == 1) { return result[0] }
    if (result.length > 1) {
      if (result[1].length){
        if (result[1].length > 1){ return { status: "e", payload: "Expected one result but got multiple" } }
        return result[1][0]
      }
      else { return result[1] }
    }
  }
  else {
    return result
  }
  return result
}

module.exports = dbLogic
