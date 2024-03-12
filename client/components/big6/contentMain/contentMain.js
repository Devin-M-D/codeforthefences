cDI.components.contentMain = {
  html: `<span id="contentMain" class="grow shyScroll"></span>`,
  loadPage: async (name) => {
    $("#contentMain").empty()
    var pageDI = await ftbLoadComponent("pages", name)
    if (pageDI && pageDI.drawPage) {
      await pageDI.drawPage($("#contentMain"))
    }
    else {
      $("#contentMain").html("<span class='hardCenter'>Malformed page content!</span>")
    }
    return pageDI
  }
}
