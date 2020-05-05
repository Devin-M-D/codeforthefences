//jquery .ready()
$(() => {
  console.log("App loaded, firing strapApp()")
  strapApp(true)
})

async function strapApp(doUnitTests = false){
  await $.get("pages/globals/header.html", (val) => { $("body").prepend(val) })
  await $.get("pages/home.html", (val) => { $("#bodyMain").append(val) })
  await $.get("components/modals.html", (val) => { $("#cargoHold").append(val) })

  if (doUnitTests){
    await loadScript("js/unitTests/unitTests.js")
    runTests()
  }
}

function asyncClick(func) {
  return func()
}

//Ajax Methods
//////////////
function remoteCall(remoteURL, postData = {}, enable_logging = false) {
  if (enable_logging){
    console.log({
      "url": remoteURL,
      "data": postData
    })
  }
  postData = JSON.stringify(postData) || {}
  var callType = "POST"
  var contentType = "application/json; charset=utf-8"
  var dataType = "json"
  if (remoteURL.indexOf(".json") != -1 || remoteURL.indexOf(".html") != -1) {
    callType = "GET"
    if (remoteURL.indexOf(".json") != -1){
      contentType = "text/html; charset=UTF-8"
    }
    if (remoteURL.indexOf(".html") != -1){
      contentType = "text/html; charset=UTF-8"
      dataType = "html"
    }
  }

  return promise = new Promise(function (fulfill, reject) {
    $.ajax({
      type: callType,
      url: remoteURL,
      data: postData,
      contentType: contentType,
      dataType: dataType,
      async: false,
      success: function (msg) {
        if (enable_logging == 1) { console.log("Call to:  " + remoteURL + " - Succeeded: ") }
        fulfill(msg);
      },
      error: function (msg) {
        if (enable_logging == 1) { console.error("Call to: " + remoteURL + " - Failed:", msg) }
        reject(msg)
      },
    })
  });
}

function loadScript(hrefURL) {
  return promise = new Promise(function (fulfill, reject) {
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = hrefURL;
    script.addEventListener("error", function (e) { fulfill("failed"); }, true);
    script.addEventListener("load", function (e) { fulfill("loaded"); }, false);
    document.head.appendChild(script);
  });
}
//////////////
