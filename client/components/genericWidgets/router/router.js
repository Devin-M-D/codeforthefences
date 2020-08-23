cDI.components.router = {
  getRoute: async (path) => {
    if (path[0] == "/" || path[0] == "\\"){
      path = path.substr(1)
    }
    window.history.pushState(null, null, path);
    var DIobj = await cDI.components.contentMain.loadPage(path)
    cDI.components.header.setHeaderText(DIobj.siteHeaderText)
  }
}
cDI.components.router.init = async () => {
  if (window.location.pathname.length == 1) {
    cDI.components.router.getRoute("blog")
  }
  else {
    cDI.components.router.getRoute(window.location.pathname)
  }
}

window.onpopstate = function(event) {
  console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}
