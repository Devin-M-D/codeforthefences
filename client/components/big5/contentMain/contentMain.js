cDI.components.contentMain = {
  init: async () => {
    $("body").append(`<span id="contentMain" class="shyScroll algnSX"></span>`)
  },
  loadPage: async (name) => {
    $("#contentMain").empty()
    return await cDI.remote.loadComponent($("#contentMain"), "pages", name)
  }
}
