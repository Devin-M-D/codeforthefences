cDI.components.contentMain = {
  init: async () => {
    $("body").append(`<span id="contentMain"></span>`)
  },
  loadPage: async (name) => {
    $("#contentMain").empty()
    return await cDI.remote.loadComponent($("#contentMain"), "pages", name)
  }
}
