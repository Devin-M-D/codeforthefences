cDI.components.router = {
  init: async () => {
    var pathname = window.location.pathname
    if (pathname.length == 1) {
      await ftbCmp("router").getRoute("blog")
    }
    else {
      await ftbCmp("router").getRoute(pathname.split("/")[1], "/" + pathname.split("/").slice(2).join("/"))
    }
  },
  getRoute: async (pagePath, pathParams = "") => {
    if (pagePath[0] == "/" || pagePath[0] == "\\"){
      pagePath = pagePath.substr(1)
    }
    window.history.pushState(null, null, "/" + pagePath + pathParams)
    var cmDI = await ftbCmp("contentMain").loadPage(pagePath)
    ftbCmp("header").setHeaderText(cmDI.siteHeaderText)
  },
  getCurrentRoute: () => {
    return window.location.pathname.split("/")
  }
}

window.onpopstate = function(event) {
  console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}
