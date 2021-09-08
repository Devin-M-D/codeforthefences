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
    doIfLiteralObj: (toTest, fn) => {
      if (DI.utils.isLiteralObj(toTest)) {
        fn(toTest)
      }
    },
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
      return v8.deserialize(v8.serialize(obj))
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
    succeed: (res, payload) => {
      res.status= "s"
      res.payload = payload
    },
    fail: (res, payload) => {
      res.status= "e"
      res.payload = payload
    }
  }
}
DI.pPrint = (json) => {
  console.log(JSON.stringify(json, null, "  "))
}

module.exports = DI
