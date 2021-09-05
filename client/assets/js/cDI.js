var cDI = {
  config: {},
  services: {},
  widgets: [],
  components: {},
  pages: {},
  session: {},
}

//#region utils
cDI.utils = {
  isDef: (obj) => { return (obj != null && obj != undefined) },
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
  getDIByComponentName: (name) => {
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
  },
  randomString: (len) => {
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
  },
  wrapInPromise: (fn) => {
    return new Promise((f, r) => {
      fn(f)
    })
  }
}
//#endregion

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
cDI.sequencer.debounceFuncs = []
cDI.sequencer.debounce = async (key, fn, delay) => {
  var existing = cDI.sequencer.debounceFuncs.filter(x => x.key == key)[0]
  if (existing) {
    clearTimeout(existing.fn)
    return new Promise((fulfill, reject) => {
      existing.fn = setTimeout(async () => {
                      fulfill(await fn())
                    }, delay)
    })
  }
  else {
    return new Promise((fulfill, reject) => {
      cDI.sequencer.debounceFuncs.push({
        key: key,
        fn: setTimeout(async () => {
              fulfill(await fn())
            }, delay)
      })
    })
  }
}
//#endregion

//#region remote
cDI.remote = {
  remoteCall: async (remoteURL, postData) => {
    postDataObj = postData || {}
    ftbLogAjax(`Building call to ${remoteURL} with initial data:`,  postData, true)
    postData = JSON.stringify(postDataObj)


    var callType = "POST"
    if (remoteURL.indexOf(".json") != -1) { callType = "GET" }

    return new Promise((fulfill, reject) => {
      ftbLogAjax(`Sending call to ${remoteURL} with postData data:`,  postData, true)

      $.ajax({
        type: callType,
        url: remoteURL,
        data: postData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (callRes) {
          ftbLogAjax("Call to:  " + remoteURL + " - Succeeded: ", callRes)
          if (callRes.status == "e" && callRes.payload == "Unable to locate user session") { cDI.clearLogin()  }
          if (postDataObj.expectOne){ fulfill(callRes.payload[0]) }
          fulfill(callRes)
        },
        error: function (callRes) {
          console.error("Call to: " + remoteURL + " - Failed:", callRes)
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
        $("head").append(`<script>${res}</script>`)
        f(res)
      })
    })
  },
  asyncGetCSS: (path) => {
    $(`<link rel="stylesheet" type="text/css" href="${path}" />`).appendTo('head')
  }
}
cDI.remote.loadSimpleComponent = async (folderPath, componentName) => {
  var path = `/${folderPath}/${componentName}/${componentName}`
  await cDI.remote.asyncGetScript(`${path}.js`)
  await cDI.remote.asyncGetCSS(`${path}.css`)
  var DI = cDI.utils.getDIByComponentName(componentName)
  if (DI.init) { await DI.init() }
  return DI
}
cDI.remote.loadComponent = async (elem, folderPath, componentName, placement = 1) => {
  var path = `/${folderPath}/${componentName}/${componentName}`
  await cDI.remote.asyncGetCSS(`${path}.css`)
  await cDI.remote.asyncGetScript(`${path}.js`)
  var html = await cDI.remote.asyncGet(`${path}.html`)

  if (placement == 0) { elem.prepend(html) }
  else if (placement == 1) { elem.append(html) }

  ftbLogDev(`loading ${path}`)
  var DI = cDI.utils.getDIByComponentName(componentName)
  if (DI.init) { await DI.init() }
  return DI
}
//#endregion

//#region logging
cDI.logging = {
  log: async (message, data = null, levelOfMessage = 1, trace = false, callbackFn = null) => {
    async function send(msg, obj, trace, fn) {
      cDI.logging.ifTrace(`${cDI.logging.tabSize}${msg}`, obj, trace)()

      if (cDI.utils.isDef(fn)) {
        cDI.logging.ifTrace(`${cDI.logging.tabSize}running function passed to log call ${fn.name}`, null, trace)()
        await fn()
        cDI.logging.ifTrace(`${cDI.logging.tabSize}${fn.name}() completed`, null, trace)()
      }
    }
    var tmpDebugMode = cDI.config.debugMode
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

    if (levelOfMessage == 1 && allowDev) { await send(message, data, trace, callbackFn) }
    else if (levelOfMessage == 2 && allowVerbose) { await send(message, data, trace, callbackFn) }
    else if (levelOfMessage == 4 && allowAJAX) { await send(message, data, trace, callbackFn) }
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
  tabSize: "",
  indent: () => { cDI.logging.tabSize += "  " },
  outdent: () => { cDI.logging.tabSize = cDI.logging.tabSize.slice(0, -2) }
}
//#endregion

//#region async inputs
cDI.addAwaitableInput = (inputType, elem, fn, trace = false, debounce = true) => {
  elem.on(inputType, async (e) => {
    ftbLogDev(`${inputType} occurred on elem: `, $(elem), trace)
    var data = await fn(e)
    ftbLogDev(`result is: `, $(data), trace)
    return data
  })
}
cDI.awaitableInput = async (inputType, elem) => {
  return new Promise((fulfill, reject) => {
    $.when(elem.triggerHandler(inputType)).then(async (res) => {
      fulfill(res)
    })
  })
}

//#endregion

//#region effects
cDI.effects = {}
cDI.effects.toastPulse = (state, target, speed) => {
  var debounceClass = speed ? "debounceToastFast" : "debounceToastSlow"
  var delay = speed ? 500 : 2000
  var classes = target.attr("class").split(" ")
  if (state == 0 || state == "pend") {
    if (
        !(classes.includes("debounceToastFast") || classes.includes("debounceToastSlow"))
        || (!classes.includes("toastSucceed") && !classes.includes("toastFail"))
    ){
      target.addClass(debounceClass)
      target.addClass("toastInProcess")
      target.removeClass("toastSucceed")
      target.removeClass("toastFail")
      clearTimeout(target.data("debounceToasting"))
      target.data("debounceToasting", setTimeout(() => {
        target.removeClass("toastInProcess")
        target.data("debounceToasting", setTimeout(() => {
          target.removeClass(debounceClass)
        }, delay))
      }, delay))
    }
    else {
      setTimeout(() => { cDI.effects.toastPulse(0, target, speed) }, 250)
    }
  }
  if (state == 1 || state == "succeed") {
    if (
      !(classes.includes("debounceToastFast") || classes.includes("debounceToastSlow"))
      || (!classes.includes("toastInProcess") && !classes.includes("toastFail"))
    ){
      target.addClass("toastSucceed")
      target.addClass(debounceClass)
    //   target.addClass("toastSucceed")
    //   target.removeClass("toastFail")
      clearTimeout(target.data("debounceToasting"))
      target.data("debounceToasting", setTimeout(() => {
        target.removeClass("toastSucceed")
        target.data("debounceToasting", setTimeout(() => {
          target.removeClass(debounceClass)
        }, delay))
      }, delay))
    }
    else {
      setTimeout(() => { cDI.effects.toastPulse(1, target, speed) }, 250)
    }
  }
  // if (state == 2 || state == "fail") {
  //   target.addClass("toastFail")
  //   target.removeClass("toastSucceed")
  //   setTimeout(() => { target.removeClass("toastFail") }, 500)
  // }
}
cDI.effects.toastPulseRepeat = (state, target, speed) => {
  var delay = speed ? 1050 : 4050
  cDI.effects.toastPulse(state, target, speed)
  target.data("repeatToasting", setTimeout(() => {
    cDI.effects.toastPulseRepeat(state, target, speed)
  }, delay))
},
cDI.effects.endToastPulseRepeat = (target) => {
  clearTimeout(target.data("repeatToasting"))
  target.removeClass("debounceToastFast")
  target.removeClass("debounceToastSlow")
  target.removeClass("toastInProcess")
  target.removeClass("toastSucceed")
  target.removeClass("toastFail")
}
//#endregion

//#region stdIcons
cDI.stdIcons = {}
cDI.stdIcons.btnAddRemove = (addOrRemove, size, id) => {
  return `
  <span ${id ? `id="${id}"` : ``} class="btnIcon" data-btnsize="${size ? size : `55`}">
    <span class="${addOrRemove == "add" ? `shpPlus` : `shpMinus`}"></span>
  </span>`
}
//#endregion

//#region localstorage
cDI.persist = async (name, val) => {
  window.localStorage.setItem(name, val)
}
cDI.stored = (name) => {
  return window.localStorage.getItem(name)
}
cDI.unpersist = async (name) => {
  window.localStorage.removeItem(name)
}
cDI.unpersistAll = async () => {
  window.localStorage.clear()
}
//#endregion

//#region session
cDI.session = {
  setSession: async (un, token) => {
    await cDI.persist("codeforthefences.username", un)
    await cDI.persist("codeforthefences.token", token)
    cDI.session.username = cDI.stored("codeforthefences.username")
    cDI.session.token = cDI.stored("codeforthefences.token")
  },
  logout: async () => {
    var callRes = await cDI.remote.remoteCall("/logout")
    await cDI.session.clearLogin()
  },
  clearLogin: async () => {
    await cDI.unpersist("codeforthefences.username")
    await cDI.unpersist("codeforthefences.token")
    cDI.session.username = null
    cDI.session.token = null
    await cDI.components.header.strapAuthButton()
  },
  username: cDI.stored("codeforthefences.username"),
  token: cDI.stored("codeforthefences.token")
}
//#endregion

//#region functional toolbelt
var ftbLog = cDI.logging.log
var ftbIndent = cDI.logging.indent
var ftbOutdent = cDI.logging.outdent
var ftbLogDev = (() => {
  return async (message, data = null, trace = false, callbackFn = null) => {
    await ftbLog(message, data, 1, trace, callbackFn)
  }
})()
var ftbLogUT = (() => {
  return async (message, data = null, trace = false, callbackFn = null) => {
    await ftbLog(message, data, 2, trace, callbackFn)
  }
})()
var ftbLogAjax = (() => {
  return async (message, data = null, trace = false, callbackFn = null) => {
    await ftbLog(message, data, 4, trace, callbackFn)
  }
})()
//#endregion
