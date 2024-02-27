cDI.components.header = {
  html: `
    <span id="siteHeader" class="flex rows">
      <span class="hamburgerBox" style="height:100%">
        <span class="shpHamburger"></span>
      </span>
      <span id="siteHeaderText" class="rows grow centerContents">
        <span id="siteName" class="header">Code for the Fences</span>
        <span id="pageName" class="iSubheader"></span>
      </span>
      <span id="acctMenuBtn" class="shpUser" style="height:100%"></span>
    </span>
  `,
  init: async () => {
    await cDI.components.header.strapAuthButton()
    await ftbCmp("header").strapHeaderHamburger()
  },
  setHeaderText: (text) => {
    $("#pageName").html(text)
  },
  strapAuthButton: async () => {
    if ($("#accountDash") || $("#signupLoginBox")) { cDI.components.modal.raiseCurtain() }
    $("#acctMenuBtn").off("click")
    if (cDI.utils.isDef(cDI.session.token)){
      await ftbCmp("modal").clickToModal($("#acctMenuBtn"), "components/genericWidgets", "accountDash", async (createdElem) => {
        await cDI.components.accountDash.strapAccountDash()
        return createdElem
      }, true)
    }
    else {
      await ftbCmp("modal").clickToModal($("#acctMenuBtn"), "components/genericWidgets", "auth", async () => {})
    }
  },
  strapHeaderHamburger: async () => {
    await ftbAddInput("click.openHamburger", $("#siteHeader > .hamburgerBox"), async () => {
      await ftbCmp("header").buildMainNav()
    })
  },
  buildMainNav: async () => {
    var dpDI = ftbCmp("drawerPane")
    var pane = await dpDI.createDrawerPane($("html"))
    await dpDI.populateDrawerPane(pane, `
      <span id="dpMainNav">
        <span id="dpMainNavHeader" class="flex rows">
          ${dpDI.drawerPaneCloseButton}
        </span>
        <span id="dpMainNavContent" class="shyScroll algnS">
          <span class="fauxrder">
            <span id="mainNavAbout" class="btnStd subheader">About</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavBlog" class="btnStd subheader">Blog</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavCookbook" class="btnStd subheader">Cookbook</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavDarkRoom" class="btnStd subheader">Dark Room</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavBudget" class="btnStd subheader">Budget</span>
          </span>
          <span class="fauxrder">
            <span id="mainNavGames" class="btnStd subheader">Games</span>
          </span>
        </span>
      </span>
    `)
    await ftbAddInput("click.closeDrawerPane", pane.find("mainMenuClose"), async () => {
      await ftbCmp("drawerPane").closeDrawerPane($(this).parent().parent().parent().parent())
    })
    cDI.components.header.addMainNavClick(pane, $("#mainNavAbout"), '/about')
    cDI.components.header.addMainNavClick(pane, $("#mainNavBlog"), '/blog')
    cDI.components.header.addMainNavClick(pane, $("#mainNavCookbook"), '/cookbook')
    cDI.components.header.addMainNavClick(pane, $("#mainNavDarkRoom"), '/darkRoom')
    cDI.components.header.addMainNavClick(pane, $("#mainNavBudget"), '/budget')
    cDI.components.header.addMainNavClick(pane, $("#mainNavGames"), '/games')
    await cDI.components.drawerPane.openDrawerPane(pane)
  },
  addMainNavClick: (pane, elem, routePath) => {
    ftbAddInput("click.mainNav", elem, async e => {
      await cDI.components.router.getRoute(routePath)
      await cDI.components.drawerPane.closeDrawerPane(pane)
    })
  }
}
