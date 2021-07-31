cDI.components.header = {
  init: async () => {
    $("body").prepend(`
      <span id="siteHeader" class="wingedHeader algnSpread" data-headerheight="200px" data-headerwings="20%" data-headerwingmin="200px" data-headerwingmax="250px">
        <span id="hamburgerBox">
          <span class="shpHamburger"></span>
        </span>
        <span id="siteHeaderText" class="header"></span>
        <span id="authBox">
          <span id="iconAuth"></span>
        </span>
      </span>
    `)
    await cDI.components.header.strapAuthButton()
    await cDI.components.header.strapHeaderHamburger()
  },
  setHeaderText: (text) => {
    $("#siteHeaderText").html(text)
  },
  strapAuthButton: async () => {
    if ($("#accountDash") || $("#signupLoginBox")) { cDI.components.modal.raiseCurtain() }
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
      <span class="algnSX">
        <span class='rows autoH algnSpread'>
          <span class="mainMenuDevIcon autoW noUnderline">{}</span>
          <span class="mainMenuClose autoW noUnderline">
            <span class="btnIcon" data-btnsize="55" onclick="cDI.components.drawerPane.closeDrawerPane($(this).parent().parent().parent().parent())">
              <span class="shpCancel"></span>
            </span>
          </span>
        </span>
        <span class="mainMenuTitle autoH header">Main Menu</span>
          <span class="autoH algnSX">
          <span class="fauxrder">
            <span class="btnStd subheader" style="flex-basis: 100px;" onclick="cDI.components.router.getRoute('/blog')">Blog</span>
          </span>
          <span class="fauxrder">
          <span class="fauxrder btnStd subheader" style="flex-basis: 100px;"  onclick="cDI.components.router.getRoute('/cookbook')">Cookbook</span>
          </span>
          <span class="fauxrder">
          <span class="fauxrder btnStd subheader" style="flex-basis: 100px;"  onclick="cDI.components.router.getRoute('/darkRoom')">Dark Room</span>
          </span>
          <span class="fauxrder">
          <span class="fauxrder btnStd subheader" style="flex-basis: 100px;"  onclick="cDI.components.router.getRoute('/brewGames')">Brew Games</span>
          </span>
        </span>
      </span>
    `)
    return pane
  }
}
