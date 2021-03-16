const v8 = require('v8');

module.exports = (DI) => {
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
    // extrudeFlatGraph: (dataset) => {
    //   var indent = () => { tabDist = tabDist + "  " }
    //   var outdent = () => { tabDist = tabDist.substr(2) }
    //   var tabDist = ""
    //   var allPossibleChildren = dataset
    //   var allClasses = DI.utils.unique(allPossibleChildren, "@class")
    //   // console.log(`${tabDist}allClasses`, allClasses)
    //
    //   function locateRid(itemDepth, linkrid) {
    //     //linkrid = DI.data.parseRid(linkrid)
    //     var inEl = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && x["$depth"] < itemDepth })[0]
    //     // if (inEl) { console.log(`${tabDist}found ${inEl["@rid"]} as ${inEl["@class"]} but at lower depth ${inEl["$depth"]}`) }
    //
    //     var any = allPossibleChildren.filter(x => { return x["@rid"] == linkrid })[0]
    //     // if (!any) { console.log(`${tabDist}rid ${linkrid} not found in set`) }
    //
    //     var linkObj = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && (x["$depth"] >= itemDepth) })[0]
    //
    //     // var inEl = allPossibleChildren.filter(x => { return DI.data.parseRid(x["@rid"]) == linkrid && x["$depth"] < itemDepth })[0]
    //     // // if (inEl) { console.log(`${tabDist}found ${inEl["@rid"]} as ${inEl["@class"]} but at lower depth ${inEl["$depth"]}`) }
    //     //
    //     // var any = allPossibleChildren.filter(x => { return DI.data.parseRid(x["@rid"]) == linkrid })[0]
    //     // // if (!any) { console.log(`${tabDist}rid ${linkrid} not found in set`) }
    //     //
    //     // var linkObj = allPossibleChildren.filter(x => { return DI.data.parseRid(x["@rid"]) == linkrid && (x["$depth"] >= itemDepth) })[0]
    //     if (linkObj) {
    //       var objToReplaceWith = DI.utils.clone(linkObj)
    //       // console.log(`${tabDist}found ${cDI.utils.legId(objToReplaceWith)}`)
    //       objToReplaceWith = anchorItem(objToReplaceWith)
    //       return objToReplaceWith
    //     }
    //     // else { return { rid: linkrid, class: any["@class"] } }
    //     else { return linkrid }
    //   }
    //   function getChild(item, prop){
    //     var itemProp = item[prop]
    //     var newProp
    //     if (Array.isArray(itemProp)){
    //       newProp = []
    //       itemProp.map(linkrid => {
    //         newProp.push(locateRid(item["$depth"], linkrid))
    //       });
    //     }
    //     else {
    //       newProp = locateRid(item["$depth"], itemProp)
    //     }
    //     return newProp
    //   }
    //
    //   function extrudeUnclassedVar(item, prop) {
    //     var itemProp = item[prop]
    //     var opIdx = 0
    //     if (prop == "in") { opIdx = 1 }
    //     if (itemProp) {
    //         // console.log(`${tabDist}${opIdx}. replacing ${prop} var`, itemProp)
    //         var newProp = getChild(item, prop)
    //         // console.log(`${tabDist}with ---> `, newProp)
    //         var cleanPropName = prop
    //         if (newProp["@class"]) { cleanPropName = `${((prop == "in") ? `in_` : ``)}${newProp["@class"]}` }
    //         else if (Array.isArray(newProp)){ cleanPropName = newProp[0]["@class"] }
    //         // console.log(`${tabDist}removing old property ${prop}`)
    //         delete item[prop]
    //         // console.log(`${tabDist}setting new property ${cleanPropName}`)
    //         item[cleanPropName] = newProp
    //     }
    //     // else { console.log(`${tabDist}${opIdx}. ${prop} prop not found on ${cDI.utils.legId(item)}`) }
    //   }
    //   function extrudeClassedVars(item, prop) {
    //     var i =  0
    //     function getAndSetAndRemove(exTtem, replaceName, cleanName) {
    //       i++
    //       // console.log(`${tabDist}*****`)
    //       // console.log(`${tabDist}${i}. CLASS FOUND in ${cDI.utils.legId(exTtem)}: ${cleanName}`)
    //       // console.log(`${tabDist}replacing ${cDI.utils.legId(exTtem)} prop ${replaceName}`, exTtem[replaceName])
    //       var newProp = getChild(exTtem, replaceName)
    //       if (cleanName == "OUser") { cleanName = "user" }
    //       exTtem[cleanName] = newProp
    //       // console.log(`${tabDist}with ---> ${cleanName}`, exTtem[cleanName])
    //       // console.log(`${tabDist}removing old property ${replaceName}`)
    //       delete item[replaceName]
    //     }
    //     var opIdx = 0
    //     if (prop == "in") { opIdx = 1 }
    //     // console.log(`${tabDist}${opIdx}. ${prop} class vars`)
    //     indent()
    //     var classesNotFound = []
    //     allClasses.map((className) => {
    //       var oldPropName = `${prop}_${className}`
    //       var newName = className
    //       if (!item[oldPropName]) { oldPropName = `${prop}_${className}A`; newName = `${className}A` }
    //       if (!item[oldPropName]) { oldPropName = `${prop}_${className}B`; newName = `${className}B` }
    //       if (item[oldPropName]) {
    //         getAndSetAndRemove(item, oldPropName, newName)
    //         if (oldPropName == `${prop}_${className}A`) { getAndSetAndRemove(item, `${prop}_${className}B`, `${className}B`) }
    //       }
    //       else {
    //         classesNotFound.push(className)
    //       }
    //     });
    //     // console.log(`${tabDist} ${classesNotFound.length} CLASSES NOT FOUND`, classesNotFound)
    //     outdent()
    //   }
    //   function anchorItem(item) {
    //     // console.log(`${tabDist}anchoring item ${cDI.utils.legId(item)}`, item)
    //     // console.log(`${tabDist}-------------`)
    //     indent()
    //     var replacedOuts = extrudeUnclassedVar(item, "out")
    //     var replacedClassedOuts = extrudeClassedVars(item, "out")
    //     var replacedIns = extrudeUnclassedVar(item, "in")
    //     var replacedClassedIns = extrudeClassedVars(item, "in")
    //     outdent()
    //     // console.log(`${tabDist}///----------`)
    //     return item
    //   }
    //   function anchorSet(set) {
    //     // console.log(`${tabDist}anchoring set `, set)
    //     // console.log(`${tabDist}@@@@@@@@@@@@@`)
    //     indent()
    //     set = set.map(item => {
    //       return anchorItem(item)
    //     })
    //     outdent()
    //     return set
    //     // console.log(`${tabDist}///@@@@@@@@@@`)
    //   }
    //
    //   var rootLayer = dataset.filter(rec => { return rec["$depth"] == 0 })
    //   var  hierarchicalObj = anchorSet(rootLayer)
    //   return hierarchicalObj
    // }
  },
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
