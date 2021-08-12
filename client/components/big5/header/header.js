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
    $("#authBox").off("click")
    if (cDI.utils.isDef(cDI.session.token)){
      await cDI.components.modal.clickToModal($("#authBox"), "components/genericWidgets", "accountDash", async (createdElem) => {
        await cDI.components.accountDash.strapAccountDash()
        return createdElem
      }, true)
    }
    else {
      await cDI.components.modal.clickToModal($("#authBox"), "components/genericWidgets", "auth", async () => {})
    }
  },
  strapHeaderHamburger: () => {
    cDI.addAwaitableInput("click", $("#hamburgerBox"), async () => {
      await cDI.components.header.buildMainNav()
    })
  },
  buildMainNav: async () => {
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
            <span id="mainNavBlog" class="btnStd subheader" style="flex-basis: 100px;">Blog</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavCookbook" class="btnStd subheader" style="flex-basis: 100px;">Cookbook</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavDarkRoom" class="btnStd subheader" style="flex-basis: 100px;">Dark Room</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavBudget" class="btnStd subheader" style="flex-basis: 100px;">Budget</span>
          </span>
        </span>
      </span>
    `)
    cDI.components.header.addMainNavClick(pane, $("#mainNavBlog"), '/blog')
    cDI.components.header.addMainNavClick(pane, $("#mainNavCookbook"), '/cookbook')
    cDI.components.header.addMainNavClick(pane, $("#mainNavDarkRoom"), '/darkRoom')
    cDI.components.header.addMainNavClick(pane, $("#mainNavBudget"), '/budget')
    await cDI.components.drawerPane.openDrawerPane(pane)
  },
  addMainNavClick: (pane, elem, routePath) => {
    cDI.addAwaitableInput("click", elem, async e => {
      await cDI.components.router.getRoute(routePath)
      await cDI.components.drawerPane.closeDrawerPane(pane)
    })
  }
}
