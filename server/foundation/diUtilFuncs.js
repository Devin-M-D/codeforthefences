var v8 = require('v8');
var moment = require('moment')

module.exports = (DI) => {
  DI.moment = moment
  DI.datetimes = {
    utcNow: () => {
      return DI.moment.utc().format("YYYY-MM-DD hh:mm:ss")
    }
  }
  DI.utils = {
    isDef: (obj) => { return (obj != null && obj != undefined) },
    findSession: (req) => {
      // return DI.sessions.find((session) => {
      //   if (DI.utils.isDef(session)){ return session.token == req.body.token; }
      //   else { return false }
      // })
    },
    pluck: (arr, key) => {
      return arr.map(x => { return x[key] })
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
  }
  DI.rh = {
    asyncRoute: (callback) => {
      return function (req, res, next) {
        callback(req, res, next).catch(next)
      }
    },
    transformExpectMany: (req, data) => {
      if (!DI.utils.isDef(req.body.expectMany) && data.length == 1) { return data[0] }
      else return data
    },
    query: async (req, osql, params = null) => {
      if (!DI.utils.isDef(req.dbPool)) { return false }
      var data = await DI.data.runQuery(req.dbPool, osql, params)
      return DI.rh.transformExpectMany(req, data)
    },
    command: async (req, osql, params = null) => {
      if (!DI.utils.isDef(req.dbPool)) { return false }
      var data = await DI.data.runCommand(req.dbPool, osql, params)
      return DI.rh.transformExpectMany(req, data)
    },
    batch: async (req, osql, params = null) => {
      if (!DI.utils.isDef(req.dbPool)) { return false }
      var query = `BEGIN; ${osql} COMMIT;`
      if (osql.indexOf("$res") != -1) { query += `RETURN $res;` }
      var data = await DI.data.runBatch(req.dbPool, query, params)
      return DI.rh.transformExpectMany(req, data)
    },
    succeed: async (res, payload) => {
      res.json({ status: "s", payload: payload })
    },
    fail: async (res, payload) => {
      res.json({ status: "e", payload: payload })
    }
  }
}
