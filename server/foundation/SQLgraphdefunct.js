var DI = require('./DICore')

var db

var queryGenerator = (resultSets) => {
  var retVal = ""
  var params = []
  function beginSelect (tableName) {
    retVal +=
    `CREATE TEMPORARY TABLE tmp_${tableName} (
  SELECT {{projections}}
  FROM ${tableName}`
  }
  function closeSet (tableName) {
    retVal +=
    `
);
SELECT * FROM tmp_${tableName};

`
  }
  function addJoins (joins) {
    joins.forEach(x => {
      addJoin(x)
    })
  }
  function addJoin (joinData) {
      retVal += `
  ${joinData.dir == "<" ? "LEFT" : "INNER"} JOIN ${joinData.rightTable} ON ${joinData.leftId} = ${joinData.rightTable}.${joinData.rightId}`
  }
  function addWheres (wheres) {
    if (wheres.length > 0) {
      retVal += `
      WHERE 1=1`
    }
    wheres.forEach(x => {
      addWhere(x)
    })
  }
  function addWhere (whereData) {
      retVal += `
  AND ${whereData.table}.${whereData.field} ${whereData.op} = ?`
    params.push(whereData.value)
  }
  function addProjections (projections) {
    retVal = retVal.replace("{{projections}}", projections.join(", "))
  }

  for (var x = 0; x < resultSets.length; x++) {
    var currSet = resultSets[x]
    beginSelect(currSet.baseTable)
    addProjections(currSet.projections)
    addJoins(currSet.joins)
    addWheres(currSet.joins)
    closeSet(currSet.baseTable)
  }
  return [retVal, params]
}

var getBuilder = () => {
  var query = ""
  var resultSets = []
  var builder = {
      query: () => { return query },
      parseModel: (builder, model) => {
        function parseKey (key) {
          var dir
          if (key[0] == "<"){
            dir = key[0]
            key = key.substring(1)
          }
          var table = key
          var alias = key
          if (key.indexOf(":") != -1) {
            var split = key.split(":")
            table = split[1]
            alias = split[0]
          }
          return {
            dir:  dir,
            table: table,
            alias: alias
          }
        }
        function scrape (tree) {
          for (var item in tree.current.val){
            var setParent = tree.setParent
            tree.child = { key: item }
            tree.child.val = tree.current.val[item]
            console.log("\n---------")
            console.log("setParent", tree.setParent ? tree.setParent.key : "")
            console.log("parent", tree.parent)
            console.log("current", tree.current)
            console.log("child", tree.child)
            console.log("---------")

            // var cleanKey = current.key
            // var joinDir = null
            // if (DI.utils.isLiteralObj(current.val)){
            //   if (item[0] == "<") {
            //     joinDir = "<"
            //     cleanKey = item.replace("<", "")
            //   }
            // }
            //
            // var tableName = cleanKey
            // var alias = cleanKey
            // if (item.indexOf(":") != -1){
            //   tableName = item.split(":")[1]
            //   alias = item.split(":")[0]
            // }
            var setParentKey
            if (setParent != undefined){
              setParentKey = parseKey(tree.setParent.key)
              console.log("setParentKey", setParentKey)
            }
            var parentKey = parseKey(tree.parent.key)
            var currKey = parseKey(tree.current.key)
            var childKey = parseKey(tree.child.key)
            console.log("parentKey", parentKey)
            console.log("currKey", currKey)
            console.log("childKey", childKey)

            if(DI.utils.isArray(tree.parent.val) && DI.utils.isLiteralObj(tree.current.val) && DI.utils.isLiteralObj(tree.child.val)){
              console.log("new set")
              builder.initSubquery()
              builder.setBaseTable(item)
              if (setParent != undefined){
                builder.addJoin(setParentKey.dir, setParentKey.table, `${setParentKey.table}_${childKey.table}`, `${childKey.table}Id`, `id`)
              }
              setParent = tree.child
            }
            else if(DI.utils.isLiteralObj(tree.current.val) && DI.utils.isLiteralObj(tree.child.val) && setParentKey.table != currKey.table){ //setParentKey.table != currKey
              console.log("soft join")
              console.log(setParentKey.table)
              console.log(currKey.table)
              console.log(`
                ${setParentKey.dir == "<" ? "LEFT" : "INNER"} JOIN ${childKey.table}
                ON ${setParentKey.table}.${childKey.table}Id = ${childKey.table}.id
              `)
              builder.addJoin(setParentKey.dir, setParentKey.table, `${childKey.table}`, `${childKey.table}Id`, `id`)

            }
            else if (currKey.table == "_WHERE"){
              var comps = tree.current.val.split(" ")
              builder.where(setParentKey.table, comps[0], comps[1], comps[2])
              continue
            }
            else if (tree.child.val == null) {
              builder.addProjection(currKey.table, childKey.table, `${currKey.table}_${childKey.alias}`)
            }

            var nextSet = {
              setParent: setParent,
              parent: tree.current,
              current: tree.child
            }
            scrape(nextSet)
          }
        }
        // function scrape (obj, currKey) {
        //   var isObj = DI.utils.isLiteralObj(obj)
        //   var isArr = DI.utils.isArray(obj)
        //   var pisObj = DI.utils.isLiteralObj(parent)
        //   var pisArr = DI.utils.isArray(parent)
        //   console.log("\n---------")
        //   console.log(`currKey: ${currKey} (${isObj ? "obj" : ""}${isArr ? "arr" : ""})`)
        //   console.log(obj)
        //   console.log("parent: ", parent)
        //   // console.log("parentType: ", parentType)
        //
        //   var keyCt = 0
        //   for (var item in obj){ keyCt++ }
        //
        //
        //   for (var item in obj){
        //     if (item == "_WHERE") {
        //       //start here
        //       builder.where()
        //     }
        //
        //     var cleanKey = item
        //     var joinDir = null
        //     if (isObj){
        //       if (item[0] == "<") {
        //         joinDir = "<"
        //         cleanKey = item.replace("<", "")
        //       }
        //     }
        //     var tableName = item
        //     var alias = item
        //     if (item.indexOf(":") != -1){
        //       tableName = item.split(":")[1]
        //       alias = item.split(":")[0]
        //     }
        //
        //     if (
        //       keyCt == 1
        //         && pisArr && isObj && DI.utils.isLiteralObj(obj[item])
        //        // && parentType == 1
        //     ){
        //       console.log("new set")
        //       builder.initSubquery()
        //       builder.setBaseTable(tableName)
        //       builder.addJoin(`item`, `${parent}_`, `id`)
        //     }
        //     else if (isObj && DI.utils.isLiteralObj(obj[item]) && parentType == 0) {
        //       builder.addJoin(joinDir, parent, cleanKey, `${cleanKey}Id`, "id")
        //     }
        //     else if (isObj && DI.utils.isLiteralObj(obj[item])){
        //       parentType = 1
        //     }
        //     else if (obj[item] == null) {
        //       builder.addProjection(parent, cleanKey, `${parent}_${cleanKey}`)
        //     }
        //     //set parent vals
        //     // var tmpParent = parent
        //     // var tmpParentType = parentType
        //     if (isObj){
        //       parent = cleanKey
        //       parentType = 0
        //     }
        //     if (isArr){
        //       parent = item
        //       parentType = 1
        //     }
        //
        //     scrape(obj[item], item)
        //     // parent = tmpParent
        //     // parentType = tmpParentType
        //
        //   }
        // }
        scrape({
          parent: { key: "" },
          current: { key: "root", val: model },
          child: { key: null }
        })
        console.log("resultSets")
        console.log(DI.pPrint(resultSets))
        queryComponents = queryGenerator(resultSets)
        console.log("query\n------\n" + queryComponents[0])
        console.log("params\n------\n" + queryComponents[1])
        query = "SELECT 1"
      },





    //   parseModel: (builder, model) => {
    //   var currParent = "root"
    //   //0 = object
    //   //1 = array
    //   var currParentType = null
    //   function scrape (obj, currKey) {
    //     console.log("\n")
    //     console.log(parcels)
    //     console.log("\n")
    //     console.log("current parent type:", currParentType)
    //     DI.utils.doIfArray(obj, x => { console.log(`${currKey} (array)`) })
    //     DI.utils.doIfLiteralObj(obj, x => { console.log(`${currKey} (obj)`) })
    //     obj == null ? console.log(`${currKey} (null)`) :
    //     console.log(obj)
    //
    //     if (obj != null) {
    //       var tableName = currKey
    //       var alias = currKey
    //       if (currKey.indexOf(":") != -1){
    //         tableName = currKey.split(":")[1]
    //         alias = currKey.split(":")[0]
    //       }
    //       console.log("tableName", tableName)
    //       console.log("alias" , alias)
    //       currParent = tableName
    //
    //       if (DI.utils.isLiteralObj() || DI.utils.isArray()){
    //
    //       }
    //
    //       DI.utils.doIfLiteralObj(obj, x => {
    //         if (currParentType == 1) {
    //           builder.initSubquery()
    //           if (parcels[parcels.length-1].baseTable == "") {
    //             parcels[parcels.length-1].baseTable = tableName
    //           }
    //         }
    //         for(var key in x) {
    //
    //           currParentType = 0
    //           scrape(x[key], key)
    //         }
    //       })
    //
    //       DI.utils.doIfArray(obj, x => {
    //         if (currParentType == 0) {
    //           builder.initSubquery()
    //           if (resultSets[parcels.length-1].baseTable == "") {
    //             resultSets[parcels.length-1].baseTable = tableName
    //           }
    //         }
    //         //resultSets[parcels.length-1].baseTable = tableName
    //         for (var item in x){
    //           currParentType = 1
    //           scrape(x[item], item)
    //         }
    //       })
    //     }
    //     else {
    //       builder.addProjection(currParent, currKey, currKey)
    //     }
    //
    //     //console.log(subqueries)
    //     if (1 == 0){
    //       for(var key in obj) {
    //         console.log("current parent:", currParent)
    //         console.log("current parent type:", currParentType)
    //         DI.utils.doIfArray(obj[key], x => { console.log("array\n-----") })
    //         DI.utils.doIfLiteralObj(obj[key], x => { console.log("obj\n-----") })
    //         console.log(key)
    //         console.log(obj[key])
    //
    //         if (obj[key] == "_ORDERBY"){
    //           DI.utils.isLiteralObj(obj[key])
    //         }
    //         if (obj[key] == "_WHERE"){
    //
    //         }
    //         DI.utils.doIfArray(obj[key], x => {
    //           var tableName = key
    //           if (key.indexOf(":" != -1)){
    //             tableName = key.split(":")[1]
    //             alias = key.split(":")[0]
    //           }
    //           //builder.beginSelect(tableName, currParent)
    //           //builder.joinEdge(tableName, `${currParent}`)
    //           console.log(builder.query())
    //           // for (var item in obj[key]){
    //             scrape(obj[key])
    //           // }
    //           builder.where(`${currParent}_${key}`, 'currParent', "=", "")
    //           console.log(currParentType)
    //           if (currParentType != 1){
    //             currParent = tableName
    //             currParentType = 1
    //           }
    //         })
    //         // DI.utils.doIfLiteralObj(obj[key], x => {
    //         //   if (currParent == null) {
    //         //     builder.startSubquery()
    //         //     builder.addProjection(key, "*")
    //         //   }
    //         //   if (currParentType != 1) { currParent = key }
    //         //   currParentType = 0
    //         //   scrape(obj[key])
    //         // })
    //         // if (obj[key] == null) {
    //         //   builder.join(key, currParent)
    //         //   console.log(builder.query())
    //         // }
    //       }
    //     }
    //   }
    //   function generateQuery () {
    //     for (var q in resultSets) {
    //       console.log(q)
    //     }
    //   }
    //   console.log("parsing model")
    //   console.log(model)
    //   scrape(model, "root")
    //   generateQuery()
    // },
    initSubquery: () => {
      resultSets.push({
        baseTable: "",
        projections: [],
        joins: [],
        wheres: [],
        params: []
      })
    },
    addProjection: (tableName, field, alias) => {
      resultSets[resultSets.length-1].projections.push(`${tableName}.${field} AS '${alias}'`)
    },
    addJoin: (dir, leftTable, rightTable, leftId, rightId) => {
      resultSets[resultSets.length-1].joins.push({
        dir: dir,
        leftTable: leftTable,
        rightTable: rightTable,
        leftId: leftId,
        rightId: rightId
      })
    },
    setBaseTable: (tableName) => {
      resultSets[resultSets.length-1].baseTable = tableName
    },
    select: (tableName, parent = null) => {
      builder.beginSelect(tableName)
      query += `;
        )
        SELECT * FROM tmp_${tableName};
      `
    },
    joinEdge: (tableName, parent = null) => {
      query += `INNER JOIN ${parent}_${tableName} ON ${parent}_${tableName}.${parent}Id = ${parent}.id
      `
    },
    join: (child, parent) => {
      query += `INNER JOIN ${child} ON ${child}.id = ${parent}.${child}Id
    `
    },
    where: (table, field, op, value) => {
    //   query += `WHERE ${table}.${field}.id ${op} ?
    // `
      resultSets[resultSets.length-1].wheres.push({
        table: table,
        field: field,
        op: op,
        value: value
      })
    },
    traverse: (dir, objectName) => {
      query += `SELECT * FROM `
    },
    send: async () => {
      return await db.runQuery(query)
    }
  }
  return builder
}

module.exports = (_db) => {
  db = _db
  // var handleRoot = (root) => {
  //   console.log("root")
  //   console.log(root)
  //   DI.utils.doIfArray()
  //   DI.utils.doIfLiteralObj(root[0], x => {
  //     console.log("test")
  //     chain.select(tableName)
  //     console.log("test")
  //     console.log(query)
  //   })
  // }
  var recurCount = 1





  return {
    read: (model) => {
      var builder = getBuilder()
      builder.parseModel(builder, model)
      return builder
    },
    // create: () => {
    //   return builder = getBuilder()
    // },
    // update: () => {
    //   return builder = getBuilder()
    // },
    // delete: () => {
    //   return builder = getBuilder()
    // }
  }
}
