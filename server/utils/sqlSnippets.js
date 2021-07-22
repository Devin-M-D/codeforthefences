function joinString(dir, leftTable, rightTable, leftField, rightField) {
  return `${dir} ${rightTable} ON ${leftTable}.${leftField} = ${rightTable}.${rightField}`
}
function buildJoin (dir) {
  if (!dir) { dir = "INNER JOIN" }
  if (dir == 1) { dir = "LEFT JOIN" }
  if (dir == 2) { dir = "RIGHT JOIN" }
  if (dir == 3) { dir = "OUTER JOIN" }
  return function (leftTable, rightTable) {
    return function (leftField, rightField) {
      leftField = leftField || `${rightTable}Id`
      rightField = rightField || `id`
      return joinString(dir, leftTable, rightTable, leftField, rightField)
    }
  }
}

function projections (table, aliased) {
  aliased = aliased == 0 ? aliased : 1
  var retVal = []
  retVal.push(`${table.tableName}.id AS ${aliased ? `${table.tableName}Id` : "id"}`)
  for (var field in table["fields"]){
    var alias = table["aliases"][field]
    field = table["fields"][field]
    retVal.push(`${table.tableName}.${field} AS ${aliased ? alias : field}`)
  }
  retVal = retVal.join(`, `)
  return retVal
}

function addSet (alias) {
  return {
    body: (queryBody) => {
      var retVal =
`CREATE TEMPORARY TABLE ${alias} (${queryBody});
SELECT * FROM ${alias};`
      return retVal
    }
  }
}

module.exports = {
  addSet: addSet,
  projections: projections,

  join: (l, r, lf, rf) => { return buildJoin(0)(l, r)(lf, rf) },
  lJoin: (l, r, lf, rf) => { return buildJoin(1)(l, r)(lf, rf) },
  rJoin: (l, r, lf, rf) => { return buildJoin(2)(l, r)(lf, rf) },
  oJoin: (l, r, lf, rf) => { return buildJoin(3)(l, r)(lf, rf) },

  ifNull: (val, string) => { return val != null ? string : `` },
  nullableValue: (val) => { return val != null ? `?` : `NULL` }
}
