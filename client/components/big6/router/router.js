cDI.components.router = {
  init: async () => {
    if (window.location.pathname.length == 1) {
      await ftbCmp("router").getRoute("blog")
    }
    else {
      await ftbCmp("router").getRoute(window.location.pathname)
    }
  },
  getRoute: async (path) => {
    if (path[0] == "/" || path[0] == "\\"){
      path = path.substr(1)
    }
    window.history.pushState(null, null, path)
    var cmDI = await ftbCmp("contentMain").loadPage(path)
    ftbCmp("header").setHeaderText(cmDI.siteHeaderText)
  }
}

window.onpopstate = function(event) {
  console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}
