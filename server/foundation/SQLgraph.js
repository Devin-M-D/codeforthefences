var sets = []
var projections = []
var wheres = []
var query = ``
var params = []

function addSet(idx, tableName) {
  sets.push(tableName)
  query +=
`CREATE TEMPORARY TABLE t${idx}_${tableName} (
  SELECT
  {{projections}}
  FROM ${tableName}`
}
function closeSet (idx, tableName) {
  query +=
`
);
SELECT * FROM t${idx}_${tableName};

`
}

function joinString(dir, leftTable, rightTable, leftField, rightField, other, otherop, otherParams) {
  if (otherParams) { params.concat(otherParams) }
  var otherOn = other ? ` AND ${other} ${otherop} ?` : ``
  query += `
  ${dir} ${rightTable} ON ${leftTable}.${leftField} = ${rightTable}.${rightField}${otherOn}`
}
function addJoin (dir) {
  if (!dir) { dir = "INNER JOIN" }
  if (dir == 1) { dir = "LEFT JOIN" }
  if (dir == 2) { dir = "RIGHT JOIN" }
  return function (leftTable, rightTable) {
    return function (leftField, rightField) {
      leftField = leftField || `${rightTable}Id`
      rightField = rightField || `id`
      return function (other, otherop, otherParams) {
        joinString(dir, leftTable, rightTable, leftField, rightField, other, otherParams)
      }
    }
  }
}
function curryJoin (dir, l, r, lf, rf, o, oo, op) {
  if (!lf && !o) {
    return addJoin(dir)(l, r)()()
  }
  if (!o) {
    return addJoin(dir)(l, r)(lf, rf)()
  }
}
function join (l, r, lf, rf, o, oo, op) { return curryJoin(0, l, r, lf, rf, o, oo, op) }
function leftJoin (l, r, lf, rf, o, oo, op) { return curryJoin(1, l, r, lf, rf, o, oo, op) }
function rightJoin (l, r, lf, rf, o, oo, op) { return curryJoin(2, l, r, lf, rf, o, oo, op) }

function addWheres () {
  if (wheres.length > 0) {
    query +=
`
  WHERE 1=1
`
  }
  for (var w in wheres){
    w = wheres[w]
    query +=
`   AND ${w[0]}.${w[1]} ${w[2]} ?
`
    params.push(w[3])
  }
}

function processModel (op, model) {
  if (op == 0) { extrudeModel(0, model) }
}

function fillModel (model) {
  for (var p in model.fields) {
    projections.push(`${model.tableName}.${model.fields[p]} AS ${model.tableName}_${model.fields[p]}`)
  }
  for (var key in model){
    if (key == "_WHERE") {
      for (var where in model[key]) {
        wheres.push([model.tableName, ...model[key]])
      }
    }
    if (key.indexOf("OO_") == 0) {
      var child = model[key]
      join(sets[sets.length - 1], child.tableName)
      fillModel(child)
    }
  }
}

function extrudeModel (setIdx, model) {
  addSet(setIdx, model.tableName)
  fillModel(model)
  addWheres()
  closeSet(setIdx, model.tableName)
  query = query.replace("{{projections}}", projections.join(`,
  `))
  projections = []
  wheres = []

  for (var key in model){
    if (key.indexOf("MM_") == 0) {

      var child = model[key]

      // if (!child._WHERE){ child._WHERE = [] }
      // child._WHERE.push([ `${model.tableName}_${child.tableName}`, "IN", `(SELECT * FROM t${setIdx}_${model.tableName})` ])

      // addSet(1, child.tableName)
      // var joinTable = `${model.tableName}_${child.tableName}`
      //join(model.tableName, joinTable, 'id', `${model.tableName}Id`)
      // join(joinTable, child.tableName)

      extrudeModel(setIdx+1, child)
    }
  }

}

module.exports = {
  read: (model) => {
    processModel(0, model)
    return {
      query: query,
      params: params
    }
  }
}
