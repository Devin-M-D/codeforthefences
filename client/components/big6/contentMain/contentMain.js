cDI.components.contentMain = {
  html: `<span id="contentMain" class="grow shyScroll"></span>`,
  loadPage: async (name) => {
    $("#contentMain").empty()
    return await ftbLoadComponent("pages", name, $("#contentMain"))
  }
}
