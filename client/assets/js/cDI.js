var cDI = {
  config: {},
  widgets: [],
  components: {},
  pages: {},
  session: {
    username: window.localStorage.getItem("cookbook.username"),
    token: window.localStorage.getItem("cookbook.token"),
  },
  utils: {
    isDef: (obj) => { return (obj != null && obj != undefined) },
    debounce: async () => {
      console.log("debouncing")
    },
    ifTrace: (msg, data = null, trace = false) => {
      if (trace) {
        if (cDI.utils.isDef(data)) { return () => { console.trace(msg, data) } }
        else { return () => { console.trace(msg) } }
      }
      else {
        if (cDI.utils.isDef(data)) { return () => { console.log(msg, data) } }
        else { return () => { console.log(msg) } }
      }
    },
    filterSplice: (arr, handlerTake, handlerLeave) => {
      var take = arr.filter(handlerTake)
      arr = arr.filter(handlerLeave)
      return take
    },
    pluck: (arr, key) => {
      return arr.map(x => { return x[key] })
    },
    unique: (arr, key) => {
      return [...new Set(cDI.utils.pluck(arr, key))]
    },
    legId: (dataObj) => {
      return `${dataObj["@class"]} ${dataObj["@rid"]}`
    },
    clone: (obj) => {
      return $.extend(true, {}, obj)
    },
    extrudeFlatGraph: (dataset, rootClass) => {
      var indent = () => { tabDist = tabDist + "  " }
      var outdent = () => { tabDist = tabDist.substr(2) }
      var tabDist = ""
      var allPossibleChildren = dataset
      var allClasses = cDI.utils.unique(allPossibleChildren, "@class")
      // console.log(`${tabDist}allClasses`, allClasses)

      function locateRid(itemDepth, linkrid, classChain) {
        var objToReplaceWith = linkrid
        var noCycle = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && classChain.indexOf(x["@class"]) == -1 })[0]
        // if (noCycle) { console.log(`${tabDist}found ${noCycle["@rid"]} as ${noCycle["@class"]} in nocycle set`) }

        var inEl = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && x["$depth"] < itemDepth })[0]
        // if (inEl) { console.log(`${tabDist}found ${inEl["@rid"]} as ${inEl["@class"]} but at lower depth ${inEl["$depth"]}`) }

        var any = allPossibleChildren.filter(x => { return x["@rid"] == linkrid })[0]
        // if (!any) { console.log(`${tabDist}rid ${linkrid} not found in set`) }

        var linkObj = allPossibleChildren.filter(x => { return x["@rid"] == linkrid && (x["$depth"] >= itemDepth) })[0]
        // if (linkObj) { console.log(`${tabDist}rid ${linkrid} found at greater depth`) }

        if (noCycle) {
          objToReplaceWith = cDI.utils.clone(noCycle)
          classChain.push(noCycle["@class"])
          // console.log(`${tabDist}found ${cDI.utils.legId(objToReplaceWith)}`)
          objToReplaceWith = anchorItem(objToReplaceWith, classChain)
          classChain.pop()
        }
        return objToReplaceWith
      }
      function getChild(item, prop, classChain){
        var itemProp = item[prop]
        var newProp
        if (Array.isArray(itemProp)){
          newProp = []
          itemProp.map(linkrid => {
            newProp.push(locateRid(item["$depth"], linkrid, classChain))
          });
        }
        else {
          newProp = locateRid(item["$depth"], itemProp, classChain)
        }
        return newProp
      }

      function extrudeUnclassedVar(item, prop, classChain) {
        var itemProp = item[prop]
        var opIdx = 0
        if (prop == "in") { opIdx = 1 }
        if (itemProp) {
            // console.log(`${tabDist}${opIdx}. replacing ${prop} var`, itemProp)
            var newProp = getChild(item, prop, classChain)
            // console.log(`${tabDist}with ---> `, newProp)
            var cleanPropName = prop
            if (newProp["@class"]) { cleanPropName = `${((prop == "in") ? `in_` : ``)}${newProp["@class"]}` }
            else if (Array.isArray(newProp)){ cleanPropName = newProp[0]["@class"] }
            // console.log(`${tabDist}removing old property ${prop}`)
            delete item[prop]
            // console.log(`${tabDist}setting new property ${cleanPropName}`)
            item[cleanPropName] = newProp
        }
        // else { console.log(`${tabDist}${opIdx}. ${prop} prop not found on ${cDI.utils.legId(item)}`) }
      }
      function extrudeClassedVars(item, prop, classChain) {
        var i =  0
        function getAndSetAndRemove(exTtem, replaceName, cleanName, classChain) {
          i++
          // console.log(`${tabDist}*****`)
          // console.log(`${tabDist}${i}. CLASS FOUND in ${cDI.utils.legId(exTtem)}: ${cleanName}`)
          // console.log(`${tabDist}replacing ${cDI.utils.legId(exTtem)} prop ${replaceName}`, exTtem[replaceName])
          var newProp = getChild(exTtem, replaceName, classChain)
          if (cleanName == "OUser") { cleanName = "user" }
          exTtem[cleanName] = newProp
          // console.log(`${tabDist}with ---> ${cleanName}`, exTtem[cleanName])
          // console.log(`${tabDist}removing old property ${replaceName}`)
          delete item[replaceName]
        }
        var opIdx = 0
        if (prop == "in") { opIdx = 1 }
        // console.log(`${tabDist}${opIdx}. ${prop} class vars`)
        indent()
        var classesNotFound = []
        allClasses.map((className) => {
          var oldPropName = `${prop}_${className}`
          var newName = className
          if (!item[oldPropName]) { oldPropName = `${prop}_${className}A`; newName = `${className}A` }
          if (!item[oldPropName]) { oldPropName = `${prop}_${className}B`; newName = `${className}B` }
          if (item[oldPropName]) {
            getAndSetAndRemove(item, oldPropName, newName, classChain)
            if (oldPropName == `${prop}_${className}A`) { getAndSetAndRemove(item, `${prop}_${className}B`, `${className}B`, classChain) }
          }
          else {
            classesNotFound.push(className)
          }
        });
        // console.log(`${tabDist} ${classesNotFound.length} CLASSES NOT FOUND`, classesNotFound)
        outdent()
      }
      function anchorItem(item, classChain) {
        // console.log(`${tabDist}anchoring item ${cDI.utils.legId(item)}`, classChain)
        // console.log(`${tabDist}-------------`)
        indent()
        var replacedOuts = extrudeUnclassedVar(item, "out", classChain)
        var replacedClassedOuts = extrudeClassedVars(item, "out", classChain)
        var replacedIns = extrudeUnclassedVar(item, "in", classChain)
        var replacedClassedIns = extrudeClassedVars(item, "in", classChain)
        outdent()
        // console.log(`${tabDist}///----------`)
        return item
      }
      function anchorSet(set) {
        // console.log(`${tabDist}anchoring set `, set)
        // console.log(`${tabDist}@@@@@@@@@@@@@`)
        indent()
        set = set.map(item => {
          return anchorItem(item, [item["@class"]])
        })
        outdent()
        return set
        // console.log(`${tabDist}///@@@@@@@@@@`)
      }

      var rootLayer = dataset.filter(rec => { return rec["@class"] == rootClass })
      var  hierarchicalObj = anchorSet(rootLayer)
      return hierarchicalObj
    },
    getDIByCIName: (name) => {
      var compKeys = Object.keys(cDI.components).reduce((keys, k) => {
        keys[k.toLowerCase()] = k;
        return keys
      }, {});
      var pageKeys = Object.keys(cDI.pages).reduce((keys, k) => {
        keys[k.toLowerCase()] = k;
        return keys
      }, {});
      if (cDI.components[compKeys[name.toLowerCase()]]){
        return cDI.components[compKeys[name.toLowerCase()]]
      }
      else if (cDI.pages[pageKeys[name.toLowerCase()]]){
        return cDI.pages[pageKeys[name.toLowerCase()]]
      }
    }
  }
}

//#region sequencer
cDI.sequencer = {
    taskChains: []
    //{ name: "chainName", chain: fn }
}
cDI.sequencer.add = async (chainName, fn) => {
    var chain = cDI.sequencer.taskChains.filter(x => x.name == chainName)
    if (chain.length > 0) {
      chain = chain[0].chain
      if (chain){
          chain = chain.then(async () => { await fn(); })
      }
   }
   else {
     cDI.sequencer.taskChains.push({ name: chainName, chain: fn() })
   }
}
cDI.sequencer.runInSequence = (funcs) => {
  return new Promise(function (fulfillSeq, rejectSeq) {
    var sequence = Promise.resolve();
    funcs.forEach(function (func) {
      sequence = sequence.then(function () { return func() });
    });
    sequence = sequence.then(function () { fulfillSeq(); });
  });
}
//#endregion

//#region remote
cDI.remote = {
  remoteCall: async (remoteURL, postData = {}, enable_logging = false) => {
    if (enable_logging) { cDI.utils.ifTrace(`Building call to ${remoteURL} with initial data:`,  postData) }

    postData = postData || {}
    if (cDI.utils.isDef(window.localStorage.getItem("cookbook.token"))) {
      postData.token = window.localStorage.getItem("cookbook.token")
    }
    postData = JSON.stringify(postData)

    var callType = "POST"
    if (remoteURL.indexOf(".json") != -1) { callType = "GET" }

    return new Promise((fulfill, reject) => {
      if (enable_logging) { cDI.utils.ifTrace(`Sending call to ${remoteURL} with postData data:`,  postData) }
      $.ajax({
        type: callType,
        url: remoteURL,
        data: postData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (callRes) {
          if (enable_logging == 1) { console.log("Call to:  " + remoteURL + " - Succeeded: ", callRes) }
          cDI.log(cDI.utils.ifTrace(`Resolved call to ${remoteURL} - succeeded:`, callRes), 4)
          if (callRes.status == "e" && callRes.payload == "Unable to locate user session") { cDI.clearLogin()  }
          fulfill(callRes)
        },
        error: function (callRes) {
          console.log("XHR failed, really shouldn't ever land here from requests to Cookbook")
          // if (enable_logging == 1) { console.error("Call to: " + remoteURL + " - Failed:", callRes) }
          // cDI.log(cDI.utils.ifTrace(`Resolved call to ${remoteURL} - failed:`, callRes), 4)
          reject(callRes);
        },
      })
    })
  },
  h: async (res, fn1, fn2) => {
    if (res.status == "s") { return await fn1(res.payload) }
    else if (res.status == "e") { return await fn2(res.payload) }
  },
  asyncGet: (path) => {
    return $.get(path).promise()
  },
  asyncGetScript: (path) => {
    return new Promise((f, r) => {
      $.getScript(path, (res) => {
        console.log(res)
        $("head").append(`<script>${res}</script>`)
        f(res)
      })
    })
  },
  asyncGetCSS: (path) => {
    $(`<link rel="stylesheet" type="text/css" href="${path}" />`).appendTo('head')
  }
}
cDI.remote.loadComponent = async (elem, folderPath, componentName, placement = 1) => {
  var path = `${folderPath}/${componentName}/${componentName}`
  await cDI.remote.asyncGetCSS(`${path}.css`)
  await cDI.remote.asyncGetScript(`${path}.js`)
  var html = await cDI.remote.asyncGet(`${path}.html`)

  if (placement == 0) { elem.prepend(html) }
  else if (placement == 1) { elem.append(html) }

  console.log(`loading ${path}`)
  var DI = cDI.utils.getDIByCIName(componentName)
  if (DI) {
    await DI.init()
  }
  else {
    console.log(DI)
  }
  return DI
}
//#endregion

cDI.log = async (logFn, levelOfMessage = 1, callbackFn = null) => {
  async function send(msgFn, fn) {
    msgFn()
    if (cDI.utils.isDef(fn)) {
      console.log(`running function passed to log call ${fn.name}`)
      await fn()
      console.log(`${fn.name}() completed`)
    }
  }
  var tmpDebugMode = cDI.debugMode
  var allowDev = false
  var allowVerbose = false
  var allowAJAX = false

  if (tmpDebugMode - 4 >= 0) {
    allowAJAX = true
    tmpDebugMode -= 4
  }
  if (tmpDebugMode - 2 >= 0) {
    allowVerbose = true
    tmpDebugMode -= 2
  }
  if (tmpDebugMode - 1 >= 0) {
    allowDev = true
    tmpDebugMode -= 1
  }

  if (levelOfMessage == 1 && allowDev) { await send(logFn, callbackFn) }
  else if (levelOfMessage == 2 && allowVerbose) { await send(logFn, callbackFn) }
  else if (levelOfMessage == 4 && allowAJAX) { await send(logFn, callbackFn) }
}
cDI.addAsyncOnclick = async (elem, fn, trace = false, debounce = true) => {
  await elem.click(async (e) => {
    cDI.log(cDI.utils.ifTrace(`clicked elem: `, $(elem), trace), 2)
    cDI.log(cDI.utils.ifTrace(`result is: `, $(data), trace), 2)
    var data = await fn(e)
    return data
  })
}
cDI.clickRes = async (elem) => {
  var clickRes = await $.when(elem.triggerHandler("click")).then(async (res) => {
    return res
  })
  return clickRes
}
cDI.wrapInPromise = (fn) => {
  return new Promise((f, r) => {
    fn(f)
  })
}
cDI.randomString = async (len) => {
  var retVal
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  var now = Date.now().toString()
  if (len > 4) {
    retVal = now.substr(0, 2) + now.substr(now.length - 3, 2)
    len -= 4
  }
  for (x = 0; x < len; x++){
    if (Math.random() > 0.5){
      var idx = Math.floor(Math.random() * Math.floor(26))
      retVal += chars[idx]
    }
    else {
      retVal += Math.floor(Math.random() * 100).toString().substr(0, 1)
    }
  }
  return retVal
}
cDI.persist = async (name, val) => {
  window.localStorage.setItem(name, val)
}
cDI.stored = async (name) => {
  window.localStorage.getItem(name)
}
cDI.unpersist = async (name) => {
  window.localStorage.removeItem(name)
}
cDI.unpersistAll = async () => {
  window.localStorage.clear()
}
cDI.logout = async () => {
  var callRes = await cDI.remote.remoteCall("/logout")
  cDI.clearLogin()
}
cDI.clearLogin = () => {
  cDI.unpersist("cookbook.username")
  cDI.unpersist("cookbook.token")
  location.reload(false)
}
//#region functional toolbelt
var ftbLog = cDI.log
//#endregion
