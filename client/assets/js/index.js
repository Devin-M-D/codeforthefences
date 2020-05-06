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
  return new Promise((f, r) => {
    func().then((result) => { f(result); })
  })
}

//Ajax Methods
//////////////
function remoteCall(remoteURL, postData = {}, enable_logging = false) {
  if (enable_logging) { console.log(`Calling ${remoteURL} with ${postData}`) }

  postData = JSON.stringify(postData) || {}
  var callType = "POST";
  if (remoteURL.indexOf(".json") != -1) { callType = "GET"; }

  return promise = new Promise(function (fulfill, reject) {
    $.ajax({
      type: callType,
      url: remoteURL,
      data: postData,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: false,
      success: function (msg) {
        if (enable_logging == 1) { console.log("Call to:  " + remoteURL + " - Succeeded: ", msg) }
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
