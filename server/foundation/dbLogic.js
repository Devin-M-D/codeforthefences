var mysql = require("mysql2")

function createConn(){
  return new Promise((f, r) => {
    f(
      mysql.createConnection({
      	host     : 'localhost',
      	user     : 'root',
      	password : 'password',
      	database : 'codeforthefences',
        multipleStatements: true
      })
    )
  })
}
function closeConn(conn) {
  return new Promise((f, r) => {
    conn.end(e => {
      if (e) { return r(e) }
      f()
    })
  })
}
function queryConn(conn, query, params) {
  return new Promise((f, r) => {
    conn.query(query, params, (e, res) => {
      if (e) { return r(e) }
      f(res)
    })
  })
}

var addTmpTable = (name, innerQuery) => {
  var query = `CREATE TEMPORARY TABLE ${tempTblName} (
${innerQuery}
);
SELECT * FROM tmp_${obj["tableName"]}_${layer}_${index};

`
  return query
}
module.exports = {
  addTmpTable: addTmpTable,
  runQuery: async (query, params = null, expectOne = 0, debug = 0) => {
    var conn = await createConn()
    var result = await queryConn(conn, query, params)
    await closeConn(conn)
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
      if (result.length > 1) { return { status: "e", payload: "Expected one result but got multiple" } }
    }
    else {
      try {
        result = result.filter((responseObj, i) => { return i % 2 == 1 })
      }
      catch{}
    }
    return result
  }
}
