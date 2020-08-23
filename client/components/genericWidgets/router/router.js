cDI.components.router = {
  getRoute: async (path, siteHeader = null) => {
    cDI.components.contentMain.loadPage(path)
    window.history.pushState(null, null, path);
    console.log(siteHeader)
    if (siteHeader != null) {
      cDI.components.header.setHeaderText(siteHeader)
    }
  }
}
cDI.components.router.init = async () => {
  if (window.location.pathname.length == 1) {
    cDI.components.router.getRoute("/blog", "Code for the Fences")
  }
}

window.onpopstate = function(event) {
  console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
}
