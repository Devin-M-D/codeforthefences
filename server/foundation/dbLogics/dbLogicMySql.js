var mysql = require("mysql")

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
module.exports = async (DI) => {
  DI.data = {
    runQuery: async (query, params = null) => {
      var conn = await createConn()
      var result = await queryConn(conn, query, params)
      await closeConn(conn)
      if (result.length == 1){ return result[0] }
      return result
    },
  }
  return true;
}
