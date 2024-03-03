cDI.components.contentMain = {
  html: `<span id="contentMain" class="grow shyScroll"></span>`,
  loadPage: async (name) => {
    $("#contentMain").empty()
    var pageDI = await ftbLoadComponent("pages", name)
    await pageDI.drawPage($("#contentMain"))
    return pageDI
  }
}
