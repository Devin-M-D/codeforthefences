cDI.components.contentMain = {
  init: async () => {

  },
  loadPage: async (name) => {
    cDI.remote.loadComponent($("#contentMain"), "pages", name)
  }
}
