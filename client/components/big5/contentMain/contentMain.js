cDI.components.contentMain = {
  init: async () => {

  },
  loadPage: async (name) => {
    $("#contentMain").empty()
    return await cDI.remote.loadComponent($("#contentMain"), "pages", name)
  }
}
