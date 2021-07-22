var ss = require('./sqlSnippets')
var db = require('../foundation/dbLogic')

var queryBuilder = {}
queryBuilder.new = () => {
  var query = ``
  var params = []
  return {
    query: () => { return query },
    params: () => { return params },
    insertQuery: (q) => { query += q },
    insertParam: (p) => { params.push(p) },
    insertParams: (...p) => { params = params.concat(p) },
    nullableValue: (p) => {
      return p != null ? "?" : "NULL"
      params.push(p)
    },
    nullableWhere: (tableName, paramName, paramVal) => {
      return paramVal != null ? `${tableName}.${paramName} = ?` : `${tableName}.${paramName} IS NULL`
      params.push(paramVal)
    },
    insertNonNullParams: (...p) => {
      for (var x = 0; x < p.length; x++){
        if (p[x] != null) params.push(p[x])
      }
    },
    run: async () => { return await db.runQuery(query, params) },
    printRunnable: () => {
      var tempQuery = query
      for (var x = 0; x < params.length; x++){
        tempQuery = tempQuery.replace('?', `'${params[x]}'`)
      }
      return tempQuery
    }
  }
}

module.exports = queryBuilder
