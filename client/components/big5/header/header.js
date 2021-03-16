cDI.components.header = {
  init: async () => {
    await cDI.components.header.strapAuthButton()
    await cDI.components.header.strapHeaderHamburger()
  },
  setHeaderText: (text) => {
    $("#siteHeaderText").html(text)
  },
  strapAuthButton: async () => {
    $("#iconAuth").empty()
    $("#authBox").off("click")
    if (cDI.utils.isDef(cDI.session.token)){
      cDI.components.modal.clickToModal($("#authBox"), "components/genericWidgets", "accountDash", async (createdElem) => {
        await cDI.components.accountDash.strapAccountDash()
        return createdElem
      }, true)
    }
    else {
      cDI.components.modal.clickToModal($("#authBox"), "components/genericWidgets", "auth", async () => {})
    }
  },
  strapHeaderHamburger: () => {
    $("#hamburgerBox").on("click", async () => {
      var pane = await cDI.components.header.buildMainMenu()
      // cDI.components.drawerPane.openDrawerPane(pane)
      setTimeout(() => {
        cDI.components.drawerPane.openDrawerPane(pane)
      }, 1)
    })
  },
  buildMainMenu: async () => {
    var pane = await cDI.components.drawerPane.createDrawerPane($("html"))
    await cDI.components.drawerPane.populateDrawerPane(pane, `
      <span class='wingedHeader' data-headerheight="10">
        <span class="header noUnderline absCen bumpBottom">{}</span>
        <span class="header absCen">Main Menu</span>
        <span class="header noUnderline absCen bumpBottom" onclick="cDI.components.drawerPane.closeDrawerPane($(this).parent().parent())">X</span>
      </span>
      <span class="cols algnSX">
        <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/blog')">Blog</span>
        <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/cookbook')">Cookbook</span>
        <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/darkRoom')">Dark Room</span>
        <span class="btnStd subheader" onclick="cDI.components.router.getRoute('/brewGames')">Brew Games</span>
      </span>
    `)
    return pane
  }
}
