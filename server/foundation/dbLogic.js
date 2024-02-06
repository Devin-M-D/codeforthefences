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

var querify = (obj, layer = 0, index = 0, where = null) => {
  var tempTblName = `tmp_${obj["tableName"]}_${layer}_${index}`
  var query = `CREATE TEMPORARY TABLE ${tempTblName} (
  SELECT
  `
  var fields = Object.entries(obj).filter(prop => { return prop[0] != "tableName" }).map(prop => { return prop[0] })
  fields = fields.join(", ")
  query += fields
  query += `
  FROM ${obj["tableName"]}`
  if (where != null){
    query += `
WHERE id IN (${where})
    `}
  query += `
);
SELECT * FROM tmp_${obj["tableName"]}_${layer}_${index};

`
  var nextLayer = Object.entries(obj).filter(prop => { return typeof prop[1] == "object" })
  var subtables = []
  var subQueries = nextLayer.map(prop => {
    var subindex = 0
    var dupeSubtables = subtables.filter(subTable => subTable[0] == prop[1].tableName)
    if (dupeSubtables.length == 0){
      subtables.push([prop[1].tableName, 0])
    }
    else {
      dupeSubtables[0][1] = dupeSubtables[0][1] + 1
      subindex = dupeSubtables[0][1]
    }
    return querify(prop[1], layer+1, subindex, `SELECT ${prop[0]} FROM ${tempTblName}`)
  })

  subQueries = subQueries.join(`
`)
  query += subQueries
  return query
}
module.exports = {
  querify: querify,
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
