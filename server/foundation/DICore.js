var v8 = require('v8')
var datetimes = require('../services/datetimes')

var DI = {
  datetimes: datetimes,
  utils: {
    isDef: (obj) => { return (obj != null && obj != undefined) },
    pluck: (arr, key) => {
      return arr.map(x => { return x[key] })
    },
    isArray: (toTest) => {
        return Array.isArray(toTest)
    },
    isLiteralObj: (toTest) => {
        return (!!toTest) && (toTest.constructor === Object) && (!Array.isArray(toTest)) && !(typeof toTest == "string")
    },
    //DI.utils.doIfLiteralObj(obj, x => { })
    doIfLiteralObj: (toTest, fn) => {
      if (DI.utils.isLiteralObj(toTest)) {
        fn(toTest)
      }
    },
    //DI.utils.doIfArray(obj, x => { })
    doIfArray: (toTest, fn) => {
      if (DI.utils.isArray(toTest)){
        fn(toTest)
      }
    },
    unique: (arr, key) => {
      return [...new Set(DI.utils.pluck(arr, key))]
    },
    legId: (dataObj) => {
      return `${dataObj["@class"]} ${dataObj["@rid"]}`
    },
    clone: (obj) => {
      return v8.deserialize(v8.serialize(obj));
    },
  },
  rh: {
    asyncRoute: (callback) => {
      return function (req, res, next) {
        callback(req, res, next)
        .then(() => { next() })
        .catch(next)
      }
    },
    transformExpectMany: (req, data) => {
      if (!DI.utils.isDef(req.body.expectMany) && data.length == 1) { return data[0] }
      else return data
    },
    // query: async (req, osql, params = null) => {
    //   if (!DI.utils.isDef(req.dbPool)) { return false }
    //   var data = await DI.data.runQuery(req.dbPool, osql, params)
    //   return DI.rh.transformExpectMany(req, data)
    // },
    // command: async (req, osql, params = null) => {
    //   if (!DI.utils.isDef(req.dbPool)) { return false }
    //   var data = await DI.data.runCommand(req.dbPool, osql, params)
    //   return DI.rh.transformExpectMany(req, data)
    // },
    // batch: async (req, osql, params = null) => {
    //   if (!DI.utils.isDef(req.dbPool)) { return false }
    //   var query = `BEGIN; ${osql} COMMIT;`
    //   if (osql.indexOf("$res") != -1) { query += `RETURN $res;` }
    //   var data = await DI.data.runBatch(req.dbPool, query, params)
    //   return DI.rh.transformExpectMany(req, data)
    // },
    succeed: (res, payload) => {
      res.status= "s"
      res.payload = payload

      // if (res._headerSent == false){
      //   res.json({ status: "s", payload: payload })
      // }
    },
    fail: (res, payload) => {
      res.status= "e"
      res.payload = payload

      // if (res._headerSent == false){
      //   res.json({ status: "e", payload: payload })
      // }
    }
  }
}
DI.pPrint = (json) => {
  console.log(JSON.stringify(json, null, "  "))
}

module.exports = DI
