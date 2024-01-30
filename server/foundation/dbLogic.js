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

module.exports = {
  runQuery: async (query, params = null, expectOne = 0) => {
    var conn = await createConn()
    var result = await queryConn(conn, query, params)
    await closeConn(conn)
    if (result.constructor.name == "OkPacket"){
      return result.insertId
    }
    result = JSON.parse(JSON.stringify(result))
    console.log("running query", result)
    console.log("query result", result)
    //result = result.filter(x => { return x.constructor.name != "OkPacket" })
    while (expectOne && result.length == 1) { return result }
    if (result.length > 1 && expectOne){ return { status: "e", payload: "Expected one result but got multiple" } }
  }
}
