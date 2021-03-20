// extrudeFlatGraph: (dataset, rootClass) => {
//   var indent = () => { tabDist = tabDist + "  " }
//   var outdent = () => { tabDist = tabDist.substr(2) }
//   var tabDist = ""
//   var allPossibleChildren = dataset
//   var allClasses = cDI.utils.unique(allPossibleChildren, "@class")
//   // console.log(`${tabDist}allClasses`, allClasses)
//
//   function locateRid(itemDepth, linkrid, classChain) {
//     var objToReplaceWith = linkrid
//     var noCycle = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && classChain.indexOf(x["@class"]) == -1 })[0]
//     // if (noCycle) { console.log(`${tabDist}found ${noCycle["@rid"]} as ${noCycle["@class"]} in nocycle set`) }
//
//     var inEl = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && x["$depth"] < itemDepth })[0]
//     // if (inEl) { console.log(`${tabDist}found ${inEl["@rid"]} as ${inEl["@class"]} but at lower depth ${inEl["$depth"]}`) }
//
//     var any = allPossibleChildren.filter(x => { return x["@rid"] == linkrid })[0]
//     // if (!any) { console.log(`${tabDist}rid ${linkrid} not found in set`) }
//
//     var linkObj = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && (x["$depth"] >= itemDepth) })[0]
//     // if (linkObj) { console.log(`${tabDist}rid ${linkrid} found at greater depth`) }
//
//     if (noCycle) {
//       objToReplaceWith = cDI.utils.clone(noCycle)
//       classChain.push(noCycle["@class"])
//       // console.log(`${tabDist}found ${cDI.utils.legId(objToReplaceWith)}`)
//       objToReplaceWith = anchorItem(objToReplaceWith, classChain)
//       classChain.pop()
//     }
//     return objToReplaceWith
//   }
//   function getChild(item, prop, classChain){
//     var itemProp = item[prop]
//     var newProp
//     if (Array.isArray(itemProp)){
//       newProp = []
//       itemProp.map(linkrid => {
//         newProp.push(locateRid(item["$depth"], linkrid, classChain))
//       });
//     }
//     else {
//       newProp = locateRid(item["$depth"], itemProp, classChain)
//     }
//     return newProp
//   }
//
//   function extrudeUnclassedVar(item, prop, classChain) {
//     var itemProp = item[prop]
//     var opIdx = 0
//     if (prop == "in") { opIdx = 1 }
//     if (itemProp) {
//         // console.log(`${tabDist}${opIdx}. replacing ${prop} var`, itemProp)
//         var newProp = getChild(item, prop, classChain)
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
//   function extrudeClassedVars(item, prop, classChain) {
//     var i =  0
//     function getAndSetAndRemove(exTtem, replaceName, cleanName, classChain) {
//       i++
//       // console.log(`${tabDist}*****`)
//       // console.log(`${tabDist}${i}. CLASS FOUND in ${cDI.utils.legId(exTtem)}: ${cleanName}`)
//       // console.log(`${tabDist}replacing ${cDI.utils.legId(exTtem)} prop ${replaceName}`, exTtem[replaceName])
//       var newProp = getChild(exTtem, replaceName, classChain)
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
//         getAndSetAndRemove(item, oldPropName, newName, classChain)
//         if (oldPropName == `${prop}_${className}A`) { getAndSetAndRemove(item, `${prop}_${className}B`, `${className}B`, classChain) }
//       }
//       else {
//         classesNotFound.push(className)
//       }
//     });
//     // console.log(`${tabDist} ${classesNotFound.length} CLASSES NOT FOUND`, classesNotFound)
//     outdent()
//   }
//   function anchorItem(item, classChain) {
//     // console.log(`${tabDist}anchoring item ${cDI.utils.legId(item)}`, classChain)
//     // console.log(`${tabDist}-------------`)
//     indent()
//     var replacedOuts = extrudeUnclassedVar(item, "out", classChain)
//     var replacedClassedOuts = extrudeClassedVars(item, "out", classChain)
//     var replacedIns = extrudeUnclassedVar(item, "in", classChain)
//     var replacedClassedIns = extrudeClassedVars(item, "in", classChain)
//     outdent()
//     // console.log(`${tabDist}///----------`)
//     return item
//   }
//   function anchorSet(set) {
//     // console.log(`${tabDist}anchoring set `, set)
//     // console.log(`${tabDist}@@@@@@@@@@@@@`)
//     indent()
//     set = set.map(item => {
//       return anchorItem(item, [item["@class"]])
//     })
//     outdent()
//     return set
//     // console.log(`${tabDist}///@@@@@@@@@@`)
//   }
//
//   var rootLayer = dataset.filter(rec => { return rec["@class"] == rootClass })
//   var  hierarchicalObj = anchorSet(rootLayer)
//   return hierarchicalObj
// },
